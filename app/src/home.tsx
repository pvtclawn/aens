import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { DEFAULT_RPC_URLS } from '../../src/config'
import { resolveAensProfileWithRpcUrls, type AensResolvedProfile } from '../../src/resolver'
import { Card, CardGrid, Shell } from './Shell'
import { capabilityBullets, ensRoot, repoUrl } from './content'
import { buildRouteLinks, normalizeEnsName } from './route-links'

function readQueryEnsName(): string {
  const params = new URLSearchParams(window.location.search)
  return normalizeEnsName(params.get('name') ?? ensRoot)
}

function writeQueryEnsName(ensName: string) {
  const links = buildRouteLinks(ensName)
  window.history.replaceState(null, '', links.landing)
}

function joinCapabilities(capabilities: string[] | null | undefined): string {
  if (!capabilities || capabilities.length === 0) {
    return '(none declared)'
  }

  return capabilities.join(', ')
}

function HomePage() {
  const initialEnsName = useMemo(() => readQueryEnsName(), [])
  const [ensName, setEnsName] = useState(initialEnsName)
  const [profile, setProfile] = useState<AensResolvedProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function runLookup(nextEnsName: string) {
    const normalizedEnsName = normalizeEnsName(nextEnsName)
    setEnsName(normalizedEnsName)
    writeQueryEnsName(normalizedEnsName)
    setIsLoading(true)
    setError(null)

    try {
      const nextProfile = await resolveAensProfileWithRpcUrls({
        ensName: normalizedEnsName,
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
  const links = buildRouteLinks(resolvedEnsName)

  const resolvedAddress = profile?.address ?? '(not found on-chain yet)'
  const declaredParent = profile?.records.parentName ?? '(not found on-chain yet)'
  const declaredService = profile?.records.serviceUrl ?? '(not found on-chain yet)'
  const declaredCapabilities = joinCapabilities(profile?.records.capabilities)

  const hasResolvedSignal = Boolean(
    profile
      && (
        profile.address
        || profile.records.parentName
        || profile.records.serviceUrl
        || (profile.records.capabilities && profile.records.capabilities.length > 0)
      ),
  )

  return (
    <Shell
      eyebrow="ÆNS"
      title="ENS Root Explorer"
      intro={<>Resolve ENS records in-browser, then jump straight into the write flow with the same root name.</>}
      actions={
        <>
          <a className="button" href={links.writeRecords}>Write records</a>
          <a className="button" href={repoUrl}>Repo</a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Lookup</h2>
          <form
            className="lookup-form"
            onSubmit={(event) => {
              event.preventDefault()
              void runLookup(ensName)
            }}
          >
            <label className="label" htmlFor="ens-root-input">ENS root</label>
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
          <h2>Resolved state</h2>
          <p>ENS root: <span className="code">{resolvedEnsName}</span></p>
          <p>Address: <span className="code">{resolvedAddress}</span></p>
          <p>aens.parent: <span className="code">{declaredParent}</span></p>
          <p>aens.service: <span className="code">{declaredService}</span></p>
          <p>aens.capabilities: <span className="code">{declaredCapabilities}</span></p>
        </Card>
      </CardGrid>

      <section className="card">
        <h2>What this app does</h2>
        <ul className="list-tight">
          {capabilityBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="small">RPC fallbacks configured: {DEFAULT_RPC_URLS.length}</p>
      </section>

      {!error && profile && !hasResolvedSignal ? (
        <section className="card">
          <h2>No records yet</h2>
          <p>
            <span className="code">{resolvedEnsName}</span> has no resolver/text records right now.
            Use the write UI to publish <span className="code">aens.capabilities</span>,{' '}
            <span className="code">aens.parent</span>, and <span className="code">aens.service</span>.
          </p>
          <div className="actions">
            <a className="button" href={links.writeRecords}>Open write UI</a>
          </div>
        </section>
      ) : null}

      {error ? (
        <section className="card">
          <h2>Lookup failed</h2>
          <p>{error}</p>
        </section>
      ) : null}
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
)
