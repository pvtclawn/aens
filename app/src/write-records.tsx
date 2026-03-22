import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createPublicClient, createWalletClient, custom, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'
import { DEFAULT_RPC_URLS } from '../../src/config'
import { resolveAensProfileWithRpcUrls } from '../../src/resolver'
import { ensRoot, repoUrl } from './content'
import { Card, CardGrid, Shell } from './Shell'
import { buildRouteLinks, normalizeEnsName } from './route-links'

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

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

function deriveResearchName(rootName: string): string {
  return `research.${normalizeEnsName(rootName)}`
}

function readInitialRootName(): string {
  const params = new URLSearchParams(window.location.search)
  return normalizeEnsName(params.get('name') ?? ensRoot)
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
  const links = buildRouteLinks(normalizedRootName)

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
        setStatus(`Writing ${index + 1}/${records.length}: ${record.targetName} ${record.key}`)

        const resolverAddress = await publicClient.getEnsResolver({ name: record.targetName })
        if (!resolverAddress) {
          throw new Error(`No resolver found for ${record.targetName}. Set resolver first in ENS Manager.`)
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

      setStatus('Done. All records written and confirmed on mainnet.')
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
      eyebrow="ÆNS"
      title="Write ENS Records"
      intro={<>Write <span className="code">aens.capabilities</span>, <span className="code">aens.parent</span>, and <span className="code">aens.service</span> via wallet.</>}
      actions={
        <>
          <a className="button" href={links.landing}>Root explorer</a>
          <a className="button" href={links.discover}>Discovery</a>
          <a className="button" href={links.research}>Research page</a>
          <a className="button" href={repoUrl}>Repo</a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Write form</h2>
          <form
            className="lookup-form"
            onSubmit={(event) => {
              event.preventDefault()
              void handleWriteRecords()
            }}
          >
            <label className="label" htmlFor="root-name-input">Root ENS</label>
            <input
              id="root-name-input"
              className="input"
              value={rootName}
              onChange={(event) => setRootName(event.target.value)}
              placeholder="vitalik.eth"
            />

            <label className="label" htmlFor="capability-name-input">Capability ENS</label>
            <div className="input-row">
              <input
                id="capability-name-input"
                className="input"
                value={capabilityName}
                onChange={(event) => setCapabilityName(event.target.value)}
                placeholder="research.vitalik.eth"
              />
              <button className="button" type="button" onClick={() => setCapabilityName(deriveResearchName(rootName))}>
                Derive
              </button>
            </div>

            <label className="label" htmlFor="service-url-input">Service URL</label>
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
              {isSubmitting ? 'Writing…' : 'Write records'}
            </button>
          </form>
        </Card>

        <Card>
          <h2>Planned writes</h2>
          <pre className="result-block">{JSON.stringify(plannedRecords, null, 2)}</pre>
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
                <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noreferrer">{tx.hash}</a>
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
