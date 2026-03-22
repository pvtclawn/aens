import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { DEFAULT_RPC_URLS } from '../../src/config'
import { resolveAensProfileWithRpcUrls, type AensResolvedProfile } from '../../src/resolver'
import { Card, CardGrid, Shell } from './Shell'
import { capabilityBullets, discoverResearchPath, ensRoot, repoUrl, researchCapabilityPath } from './content'

function readQueryEnsName(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('name')?.trim() || ensRoot
}

function writeQueryEnsName(ensName: string) {
  const params = new URLSearchParams(window.location.search)

  if (ensName === ensRoot) {
    params.delete('name')
  } else {
    params.set('name', ensName)
  }

  const query = params.toString()
  const nextUrl = query ? `/?${query}` : '/'
  window.history.replaceState(null, '', nextUrl)
}

function joinCapabilities(capabilities: string[] | null | undefined): string {
  if (!capabilities || capabilities.length === 0) {
    return '(none declared)'
  }

  return capabilities.join(', ')
}

function toDiscoverHref(ensName: string): string {
  const params = new URLSearchParams({ mode: 'live', name: ensName })
  return `${discoverResearchPath}?${params.toString()}`
}

function toResearchHref(ensName: string): string {
  const params = new URLSearchParams({ name: ensName })
  return `${researchCapabilityPath}?${params.toString()}`
}

function HomePage() {
  const initialEnsName = useMemo(() => readQueryEnsName(), [])
  const [ensName, setEnsName] = useState(initialEnsName)
  const [profile, setProfile] = useState<AensResolvedProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function runLookup(nextEnsName: string) {
    setEnsName(nextEnsName)
    writeQueryEnsName(nextEnsName)
    setIsLoading(true)
    setError(null)

    try {
      const nextProfile = await resolveAensProfileWithRpcUrls({
        ensName: nextEnsName,
        rpcUrls: DEFAULT_RPC_URLS,
      })
      setProfile(nextProfile)
    } catch (lookupError) {
      const message = lookupError instanceof Error ? lookupError.message : String(lookupError)
      setProfile(null)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void runLookup(initialEnsName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resolvedEnsName = profile?.ensName ?? ensName
  const resolvedAddress = profile?.address ?? '(no address resolved)'
  const declaredParent = profile?.records.parentName ?? '(not declared)'
  const declaredService = profile?.records.serviceUrl ?? '(not declared)'
  const declaredProofs = profile?.records.proofsUrl ?? '(not declared)'
  const declaredReceipts = profile?.records.receiptsUrl ?? '(not declared)'
  const declaredCapabilities = joinCapabilities(profile?.records.capabilities)

  return (
    <Shell
      eyebrow="ÆNS public landing"
      title="ÆNS live ENS root explorer"
      intro={
        <>
          Browser-first chain read for any ENS root. Enter a name, resolve on-chain records directly,
          then jump to discovery and capability routes with the same root identity.
        </>
      }
      actions={
        <>
          <a className="button" href={toResearchHref(resolvedEnsName)}>
            Open research capability page
          </a>
          <a className="button" href={toDiscoverHref(resolvedEnsName)}>
            Open discovery route
          </a>
          <a className="button" href={repoUrl}>
            View repo
          </a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Resolve live ENS root</h2>
          <p>
            Reads resolver/text records directly from chain in the browser using RPC fallback.
          </p>
          <form
            className="lookup-form"
            onSubmit={(event) => {
              event.preventDefault()
              void runLookup(ensName.trim())
            }}
          >
            <label className="label" htmlFor="ens-root-input">
              ENS root name
            </label>
            <div className="input-row">
              <input
                id="ens-root-input"
                className="input"
                value={ensName}
                onChange={(event) => setEnsName(event.target.value)}
                placeholder="vitalik.eth"
              />
              <button className="button" type="submit" disabled={isLoading || ensName.trim().length === 0}>
                {isLoading ? 'Resolving…' : 'Resolve'}
              </button>
            </div>
          </form>
        </Card>
        <Card>
          <h2>What ÆNS is doing</h2>
          <ul className="list-tight">
            {capabilityBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            RPC fallbacks: <span className="code">{DEFAULT_RPC_URLS.length}</span>
          </p>
        </Card>
      </CardGrid>

      {error ? (
        <section className="card">
          <h2>Lookup failed</h2>
          <p>{error}</p>
        </section>
      ) : null}

      <section className="grid two">
        <article className="card">
          <h2>Resolved identity</h2>
          <p>
            ENS root: <span className="code">{resolvedEnsName}</span>
          </p>
          <p>
            Address: <span className="code">{resolvedAddress}</span>
          </p>
          <p>
            Declared parent: <span className="code">{declaredParent}</span>
          </p>
          <p>
            Declared capabilities: <span className="code">{declaredCapabilities}</span>
          </p>
        </article>
        <article className="card">
          <h2>Resolved service records</h2>
          <p>
            aens.service: <span className="code">{declaredService}</span>
          </p>
          <p>
            aens.proofs: <span className="code">{declaredProofs}</span>
          </p>
          <p>
            aens.receipts: <span className="code">{declaredReceipts}</span>
          </p>
          <p>
            This view is chain-read truth, not a hidden backend cache.
          </p>
        </article>
      </section>
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
)
