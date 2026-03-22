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

  const resolvedRows = [
    ['ENS root', resolvedEnsName],
    ['Address', profile?.address ?? '(not found on-chain yet)'],
    ['aens.parent', profile?.records.parentName ?? '(not found on-chain yet)'],
    ['aens.service', profile?.records.serviceUrl ?? '(not found on-chain yet)'],
    ['aens.capabilities', joinCapabilities(profile?.records.capabilities)],
  ] as const

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
      intro={<>Inspect current root-state records, then jump straight into the write flow with the same ENS name.</>}
      actions={
        <>
          <a className="button" href={links.writeRecords}>Open write records</a>
          <a className="button" href={repoUrl}>Repo</a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Lookup</h2>
          <p className="helper">Resolve an ENS root and inspect the current on-chain text-record state before writing anything.</p>
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
          <dl className="data-list">
            {resolvedRows.map(([label, value]) => (
              <div className="data-row" key={label}>
                <dt>{label}</dt>
                <dd><span className="code block">{value}</span></dd>
              </div>
            ))}
          </dl>
        </Card>
      </CardGrid>

      <section className="card card-muted">
        <h2>Current scope</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Root Explorer</h3>
            <p>Resolve ENS roots in-browser and inspect current `aens.*` records without pretending there is more product than that.</p>
          </article>
          <article className="feature-card">
            <h3>Write Records</h3>
            <p>Prepare the exact `aens.capabilities`, `aens.parent`, and `aens.service` writes before the wallet boundary.</p>
          </article>
        </div>
        <ul className="scope-list">
          {capabilityBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="small">RPC fallbacks configured: {DEFAULT_RPC_URLS.length}</p>
      </section>

      {!error && profile && !hasResolvedSignal ? (
        <section className="card">
          <h2>No records yet</h2>
          <p className="notice">
            <span className="code">{resolvedEnsName}</span> does not currently expose resolver/text records.
            Open the write flow to publish <span className="code">aens.capabilities</span>,{' '}
            <span className="code">aens.parent</span>, and <span className="code">aens.service</span>.
          </p>
          <div className="actions">
            <a className="button" href={links.writeRecords}>Open write records</a>
          </div>
        </section>
      ) : null}

      {error ? (
        <section className="card">
          <h2>Lookup failed</h2>
          <p className="error-text">{error}</p>
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
