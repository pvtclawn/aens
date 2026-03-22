import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createPublicClient, createWalletClient, custom, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'
import { DEFAULT_RPC_URLS } from '../../src/config'
import {
  buildDemoRouteCapabilityDraft,
  buildPublicRouteCapabilityPlan,
  normalizeEnsName,
  type CapabilityWriteSurface,
  type EnsRecordWrite,
} from '../../src/public-route-capabilities'
import { resolveAensProfileWithRpcUrls } from '../../src/resolver'
import { ensRoot, repoUrl } from './content'
import { Card, CardGrid, Shell } from './Shell'
import { buildRouteLinks } from './route-links'

type SubmittedTx = EnsRecordWrite & {
  hash: `0x${string}`
}

type Eip1193Provider = Parameters<typeof custom>[0]

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

function readInitialRootName(): string {
  const params = new URLSearchParams(window.location.search)
  return normalizeEnsName(params.get('name') ?? ensRoot)
}

async function getWalletClient() {
  const ethereumProvider = (window as Window & { ethereum?: Eip1193Provider }).ethereum
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

async function resolveExistingCapabilities(rootName: string): Promise<string[]> {
  try {
    const profile = await resolveAensProfileWithRpcUrls({
      ensName: rootName,
      rpcUrls: DEFAULT_RPC_URLS,
    })

    return profile.records.capabilities ?? []
  } catch {
    return []
  }
}

function CapabilitySurfaceList(props: {
  surfaces: CapabilityWriteSurface[]
}) {
  return (
    <dl className="data-list">
      {props.surfaces.map((surface) => (
        <React.Fragment key={`${surface.label}-${surface.capabilityName}-${surface.serviceUrl}`}>
          <div className="data-row">
            <dt>{surface.label}</dt>
            <dd><span className="code block">{surface.capabilityName}</span></dd>
          </div>
          <div className="data-row">
            <dt>{surface.label} URL</dt>
            <dd><span className="code block">{surface.serviceUrl}</span></dd>
          </div>
        </React.Fragment>
      ))}
    </dl>
  )
}

function WriteRecordsPage() {
  const origin = window.location.origin
  const initialDraft = useMemo(() => {
    return buildDemoRouteCapabilityDraft({
      rootName: readInitialRootName(),
      origin,
    })
  }, [origin])

  const [rootName, setRootName] = useState(initialDraft.rootName)
  const [capabilitySurfaces, setCapabilitySurfaces] = useState<CapabilityWriteSurface[]>(initialDraft.capabilitySurfaces)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string>('Ready')
  const [submitted, setSubmitted] = useState<SubmittedTx[]>([])
  const [error, setError] = useState<string | null>(null)

  const normalizedRootName = normalizeEnsName(rootName)
  const routeLinks = buildRouteLinks(normalizedRootName)
  const plannedPlan = useMemo(() => {
    return buildPublicRouteCapabilityPlan({
      rootName: normalizedRootName,
      capabilitySurfaces,
    })
  }, [normalizedRootName, capabilitySurfaces])
  const hasIncompleteSurface = capabilitySurfaces.some((surface) => {
    return surface.capabilityName.trim().length === 0 || surface.serviceUrl.trim().length === 0
  })

  function updateCapabilitySurface(index: number, patch: Partial<CapabilityWriteSurface>) {
    setCapabilitySurfaces((current) => current.map((surface, surfaceIndex) => {
      if (surfaceIndex !== index) {
        return surface
      }

      return {
        ...surface,
        ...patch,
      }
    }))
  }

  function applyDemoPreset() {
    const draft = buildDemoRouteCapabilityDraft({
      rootName: normalizedRootName,
      origin,
    })

    setRootName(draft.rootName)
    setCapabilitySurfaces(draft.capabilitySurfaces)
  }

  async function handleWriteRecords() {
    setError(null)
    setSubmitted([])
    setStatus('Preparing capability write payload…')
    setIsSubmitting(true)

    try {
      const existingCapabilities = await resolveExistingCapabilities(normalizedRootName)
      const plan = buildPublicRouteCapabilityPlan({
        rootName: normalizedRootName,
        capabilitySurfaces,
        existingCapabilities,
      })
      const records = plan.plannedRecords

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

      setStatus('Done. Capability records written and confirmed on mainnet.')
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
      title="Write Records"
      intro={<>Prepare deterministic `aens.*` write intent from a root ENS name. Demo defaults are optional; capability names and service URLs remain fully editable before wallet approval.</>}
      actions={
        <>
          <a className="button" href={routeLinks.landing}>Back to root explorer</a>
          <a className="button" href={repoUrl}>Repo</a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Write form</h2>
          <p className="helper">Set a root ENS name, review derived records, and write only the exact `aens.*` values shown in Planned writes.</p>
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
              placeholder="theaens.eth"
            />

            {capabilitySurfaces.map((surface, index) => (
              <div key={`${surface.label}-${index}`}>
                <p className="helper">{surface.label}</p>
                <label className="label" htmlFor={`capability-name-${index}`}>Capability ENS name</label>
                <input
                  id={`capability-name-${index}`}
                  className="input"
                  value={surface.capabilityName}
                  onChange={(event) => updateCapabilitySurface(index, { capabilityName: event.target.value })}
                  placeholder="capability.example.eth"
                />

                <label className="label" htmlFor={`service-url-${index}`}>Service URL</label>
                <input
                  id={`service-url-${index}`}
                  className="input"
                  value={surface.serviceUrl}
                  onChange={(event) => updateCapabilitySurface(index, { serviceUrl: event.target.value })}
                  placeholder="https://service.example/path"
                />

                {surface.demoServicePath ? (
                  <p className="small">Demo preset source: <span className="code">{surface.demoServicePath}</span></p>
                ) : null}
              </div>
            ))}

            <div className="button-row">
              <button
                className="button"
                type="submit"
                disabled={isSubmitting || normalizedRootName.length === 0 || hasIncompleteSurface}
              >
                {isSubmitting ? 'Writing…' : 'Write configured capabilities'}
              </button>
              <button className="button" type="button" onClick={applyDemoPreset} disabled={isSubmitting}>
                Reset demo preset
              </button>
            </div>
          </form>
        </Card>

        <Card className="card-muted">
          <h2>Derived values</h2>
          <dl className="data-list">
            <div className="data-row">
              <dt>Root ENS</dt>
              <dd><span className="code block">{plannedPlan.rootName}</span></dd>
            </div>
            <div className="data-row">
              <dt>Root capabilities</dt>
              <dd><span className="code block">{JSON.stringify(plannedPlan.mergedCapabilities)}</span></dd>
            </div>
            <div className="data-row">
              <dt>Network</dt>
              <dd><span className="code block">Ethereum Mainnet</span></dd>
            </div>
          </dl>
          <CapabilitySurfaceList surfaces={plannedPlan.capabilitySurfaces} />
        </Card>
      </CardGrid>

      <section className="card card-muted">
        <h2>Current capability bundle</h2>
        <ul className="list-tight">
          {plannedPlan.capabilitySurfaces.map((surface) => (
            <li key={`${surface.capabilityName}-${surface.serviceUrl}`}>
              <span className="code">{surface.capabilityName}</span> → <span className="code">{surface.serviceUrl}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Planned writes</h2>
        <pre className="result-block">{JSON.stringify(plannedPlan.plannedRecords, null, 2)}</pre>
      </section>

      <section className="card">
        <h2>Status</h2>
        <p className="status-line">{status}</p>
        <p className="helper">Wallet approval stays explicit. This flow writes exactly the records shown above—no hidden mutations. If a child subname has no resolver yet, set it first in ENS Manager before retrying. Optional next step for protocol alignment: publish an `eth.aens.profile` URI for root/capability schema docs.</p>
        {error ? <p className="error-text">{error}</p> : null}
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
