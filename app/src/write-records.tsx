import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createPublicClient, createWalletClient, custom, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'
import { DEFAULT_RPC_URLS } from '../../src/config'
import { resolveAensProfileWithRpcUrls } from '../../src/resolver'
import { discoverResearchPath, ensRoot, repoUrl, researchCapabilityPath } from './content'
import { Card, CardGrid, Shell } from './Shell'

type EnsRecordWrite = {
  targetName: string
  key: string
  value: string
}

type SubmittedTx = EnsRecordWrite & {
  hash: `0x${string}`
}

const ENS_TEXT_RESOLVER_ABI = [
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'setText',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    outputs: [],
  },
] as const

function normalizeEnsName(value: string): string {
  return value.trim().toLowerCase()
}

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

function deriveResearchName(rootName: string): string {
  const normalizedRoot = normalizeEnsName(rootName)
  if (!normalizedRoot.includes('.')) {
    return `research.${normalizedRoot}`
  }

  return `research.${normalizedRoot}`
}

function toDiscoverHref(ensName: string): string {
  const params = new URLSearchParams({ mode: 'live', name: ensName })
  return `${discoverResearchPath}?${params.toString()}`
}

function readInitialRootName(): string {
  const params = new URLSearchParams(window.location.search)
  return normalizeEnsName(params.get('name')?.trim() || ensRoot)
}

function uniqueCapabilities(values: string[]): string[] {
  return [...new Set(values.map((entry) => normalizeEnsName(entry)).filter(Boolean))]
}

async function getWalletClient() {
  const ethereumProvider = (window as Window & { ethereum?: unknown }).ethereum
  if (!ethereumProvider) {
    throw new Error('No injected wallet found. Open this page in a wallet-enabled browser.')
  }

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(ethereumProvider),
  })

  const [account] = await walletClient.requestAddresses()
  if (!account) {
    throw new Error('No wallet account available.')
  }

  const chainId = await walletClient.getChainId()
  if (chainId !== mainnet.id) {
    throw new Error('Please switch your wallet to Ethereum Mainnet (chainId 1).')
  }

  return { walletClient, account }
}

async function resolveMergedCapabilities(rootName: string, capabilityName: string): Promise<string[]> {
  try {
    const profile = await resolveAensProfileWithRpcUrls({
      ensName: rootName,
      rpcUrls: DEFAULT_RPC_URLS,
    })

    return uniqueCapabilities([...(profile.records.capabilities ?? []), capabilityName])
  } catch {
    return uniqueCapabilities([capabilityName])
  }
}

function WriteRecordsPage() {
  const initialRootName = useMemo(() => readInitialRootName(), [])
  const [rootName, setRootName] = useState(initialRootName)
  const [capabilityName, setCapabilityName] = useState(deriveResearchName(initialRootName))
  const [serviceUrl, setServiceUrl] = useState(`${window.location.origin}/research-capability`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string>('Ready')
  const [submitted, setSubmitted] = useState<SubmittedTx[]>([])
  const [error, setError] = useState<string | null>(null)

  const normalizedRootName = normalizeEnsName(rootName)
  const normalizedCapabilityName = normalizeEnsName(capabilityName)
  const normalizedServiceUrl = normalizeUrl(serviceUrl)

  const plannedRecords = useMemo(() => {
    return [
      {
        targetName: normalizedRootName,
        key: 'aens.capabilities',
        value: JSON.stringify(uniqueCapabilities([normalizedCapabilityName])),
      },
      {
        targetName: normalizedCapabilityName,
        key: 'aens.parent',
        value: normalizedRootName,
      },
      {
        targetName: normalizedCapabilityName,
        key: 'aens.service',
        value: normalizedServiceUrl,
      },
    ] satisfies EnsRecordWrite[]
  }, [normalizedCapabilityName, normalizedRootName, normalizedServiceUrl])

  async function handleWriteRecords() {
    setError(null)
    setSubmitted([])
    setStatus('Preparing write payload…')
    setIsSubmitting(true)

    try {
      const mergedCapabilities = await resolveMergedCapabilities(normalizedRootName, normalizedCapabilityName)

      const records: EnsRecordWrite[] = [
        {
          targetName: normalizedRootName,
          key: 'aens.capabilities',
          value: JSON.stringify(mergedCapabilities),
        },
        {
          targetName: normalizedCapabilityName,
          key: 'aens.parent',
          value: normalizedRootName,
        },
        {
          targetName: normalizedCapabilityName,
          key: 'aens.service',
          value: normalizedServiceUrl,
        },
      ]

      const { walletClient, account } = await getWalletClient()
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(DEFAULT_RPC_URLS[0]),
      })

      const nextSubmitted: SubmittedTx[] = []

      for (const [index, record] of records.entries()) {
        setStatus(`Writing record ${index + 1}/${records.length}: ${record.targetName} ${record.key}`)

        const resolverAddress = await publicClient.getEnsResolver({ name: record.targetName })
        if (!resolverAddress) {
          throw new Error(`No resolver found for ${record.targetName}. Configure ENS resolver first.`)
        }

        const hash = await walletClient.writeContract({
          account,
          address: resolverAddress,
          abi: ENS_TEXT_RESOLVER_ABI,
          functionName: 'setText',
          args: [namehash(record.targetName), record.key, record.value],
          chain: mainnet,
        })

        await publicClient.waitForTransactionReceipt({ hash })

        nextSubmitted.push({
          ...record,
          hash,
        })

        setSubmitted([...nextSubmitted])
      }

      setStatus('Done. All planned records were written and confirmed on mainnet.')
    } catch (writeError) {
      const message = writeError instanceof Error ? writeError.message : String(writeError)
      setError(message)
      setStatus('Write failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Shell
      eyebrow="ÆNS writer"
      title="Write ENS capability records from the UI"
      intro={
        <>
          This page writes <span className="code">aens.capabilities</span>, <span className="code">aens.parent</span>,
          and <span className="code">aens.service</span> directly through your wallet.
        </>
      }
      actions={
        <>
          <a className="button" href="../">
            Back to ÆNS landing
          </a>
          <a className="button" href={toDiscoverHref(normalizedRootName)}>
            Open discovery route
          </a>
          <a className="button" href={researchCapabilityPath}>
            Open research capability page
          </a>
          <a className="button" href={repoUrl}>
            View repo
          </a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Record targets</h2>
          <form
            className="lookup-form"
            onSubmit={(event) => {
              event.preventDefault()
              void handleWriteRecords()
            }}
          >
            <label className="label" htmlFor="root-name-input">
              Root ENS name
            </label>
            <input
              id="root-name-input"
              className="input"
              value={rootName}
              onChange={(event) => setRootName(event.target.value)}
              placeholder="vitalik.eth"
            />

            <label className="label" htmlFor="capability-name-input">
              Capability ENS name
            </label>
            <div className="input-row">
              <input
                id="capability-name-input"
                className="input"
                value={capabilityName}
                onChange={(event) => setCapabilityName(event.target.value)}
                placeholder="research.vitalik.eth"
              />
              <button
                className="button"
                type="button"
                onClick={() => setCapabilityName(deriveResearchName(rootName))}
              >
                Derive from root
              </button>
            </div>

            <label className="label" htmlFor="service-url-input">
              Service URL
            </label>
            <input
              id="service-url-input"
              className="input"
              value={serviceUrl}
              onChange={(event) => setServiceUrl(event.target.value)}
              placeholder="https://example.com/research-capability"
            />

            <button
              className="button"
              type="submit"
              disabled={
                isSubmitting
                || normalizedRootName.length === 0
                || normalizedCapabilityName.length === 0
                || normalizedServiceUrl.length === 0
              }
            >
              {isSubmitting ? 'Writing…' : 'Write records via wallet'}
            </button>
          </form>
        </Card>

        <Card>
          <h2>Planned write payload</h2>
          <pre className="result-block">{JSON.stringify(plannedRecords, null, 2)}</pre>
          <p className="small">
            On submit, parent capabilities are merged with currently on-chain values (if readable), then written.
          </p>
        </Card>
      </CardGrid>

      <section className="card">
        <h2>Status</h2>
        <p>{status}</p>
        {error ? <p>{error}</p> : null}
      </section>

      {submitted.length > 0 ? (
        <section className="card">
          <h2>Confirmed transactions</h2>
          <ul className="list-tight">
            {submitted.map((tx) => (
              <li key={tx.hash}>
                <span className="code">{tx.targetName}</span> · <span className="code">{tx.key}</span> ·{' '}
                <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noreferrer">
                  {tx.hash}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WriteRecordsPage />
  </React.StrictMode>,
)
