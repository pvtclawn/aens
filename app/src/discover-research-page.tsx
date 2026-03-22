import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { DEFAULT_RPC_URLS } from '../../src/config'
import {
  renderDiscoverResearchResult,
  resolveDiscoverResearchExampleResult,
  resolveDiscoverResearchResultWithRpcUrls,
  type DiscoverResearchResult,
} from '../../src/discover-research'
import { sourceTagForLookupMode, toDiscoverSourceView } from '../../src/discover-source-label'
import { discoverResearchPath, ensRoot, repoUrl } from './content'
import { Card, CardGrid, Shell } from './Shell'
import { buildRouteLinks, normalizeEnsName } from './route-links'

type LookupMode = 'example' | 'live'

const EXAMPLE_ID = 'parent-authorized-capability'

function readQueryState(): { mode: LookupMode; ensName: string } {
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode') === 'live' ? 'live' : 'example'
  const ensName = normalizeEnsName(params.get('name') ?? ensRoot)
  return { mode, ensName }
}

function writeQueryState(input: { mode: LookupMode; ensName: string }) {
  const params = new URLSearchParams({ mode: input.mode })
  if (input.mode === 'live') {
    params.set('name', normalizeEnsName(input.ensName))
  }

  window.history.replaceState(null, '', `${discoverResearchPath}?${params.toString()}`)
}

function ResultView({ result }: { result: DiscoverResearchResult }) {
  return (
    <section className="grid two">
      <article className="card">
        <h2>Verdict</h2>
        <p>Status: <span className="code">{result.authorizationStatus}</span></p>
        <p>{result.authorizationSummary}</p>
        <p>Endpoint declared: <span className="code">{result.officialEndpointDeclared ? 'yes' : 'no'}</span></p>
        <p>Service: <span className="code">{result.serviceUrl ?? '(none declared)'}</span></p>
      </article>
      <article className="card">
        <h2>Machine result</h2>
        <pre className="result-block">{JSON.stringify(result, null, 2)}</pre>
      </article>
      <article className="card">
        <h2>Human report</h2>
        <pre className="result-block">{renderDiscoverResearchResult(result)}</pre>
      </article>
    </section>
  )
}

function DiscoverResearchPage() {
  const initial = useMemo(() => readQueryState(), [])
  const [mode, setMode] = useState<LookupMode>(initial.mode)
  const [ensName, setEnsName] = useState(initial.ensName)
  const [sourceTag, setSourceTag] = useState(() => sourceTagForLookupMode(initial.mode))
  const [result, setResult] = useState<DiscoverResearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const sourceView = useMemo(() => toDiscoverSourceView(sourceTag), [sourceTag])
  const links = buildRouteLinks(ensName)

  async function runLookup(nextMode: LookupMode, nextEnsName: string) {
    const normalizedEnsName = normalizeEnsName(nextEnsName)
    setMode(nextMode)
    setEnsName(normalizedEnsName)
    setSourceTag(sourceTagForLookupMode(nextMode))
    writeQueryState({ mode: nextMode, ensName: normalizedEnsName })
    setIsLoading(true)
    setError(null)

    try {
      const nextResult = nextMode === 'example'
        ? resolveDiscoverResearchExampleResult(EXAMPLE_ID)
        : await resolveDiscoverResearchResultWithRpcUrls({
            parentName: normalizedEnsName,
            rpcUrls: DEFAULT_RPC_URLS,
          })

      setResult(nextResult)
    } catch (lookupError) {
      const message = lookupError instanceof Error ? lookupError.message : String(lookupError)
      setResult(null)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void runLookup(initial.mode, initial.ensName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Shell
      eyebrow="ÆNS"
      title="Discovery"
      intro={<>Find the official research endpoint for a root ENS identity.</>}
      actions={
        <>
          <a className="button" href={links.landing}>Root explorer</a>
          <a className="button" href={links.research}>Research page</a>
          <a className="button" href={links.writeRecords}>Write records</a>
          <a className="button" href={repoUrl}>Repo</a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Example mode</h2>
          <p>Deterministic parent-authorized sample for demos and snapshots.</p>
          <button className="button" onClick={() => void runLookup('example', ensRoot)} type="button">
            Load example
          </button>
        </Card>

        <Card>
          <h2>Live mode</h2>
          <form
            className="lookup-form"
            onSubmit={(event) => {
              event.preventDefault()
              void runLookup('live', ensName)
            }}
          >
            <label className="label" htmlFor="ens-name">Root ENS</label>
            <div className="input-row">
              <input
                id="ens-name"
                className="input"
                value={ensName}
                onChange={(event) => setEnsName(event.target.value)}
                placeholder="vitalik.eth"
              />
              <button className="button" type="submit" disabled={isLoading || ensName.trim().length === 0}>
                {isLoading ? 'Running…' : 'Run live lookup'}
              </button>
            </div>
          </form>
        </Card>
      </CardGrid>

      <section className="card">
        <h2>Mode</h2>
        <p>
          Lookup mode: <span className="code">{mode}</span> · Source tag: <span className="code">{sourceView.raw}</span>
        </p>
        {sourceView.warning ? <p>{sourceView.warning}</p> : null}
      </section>

      {error ? (
        <section className="card">
          <h2>Lookup failed</h2>
          <p>{error}</p>
        </section>
      ) : null}

      {result ? <ResultView result={result} /> : null}
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DiscoverResearchPage />
  </React.StrictMode>,
)
