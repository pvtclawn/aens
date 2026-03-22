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
import { discoverResearchPath, ensRoot, repoUrl, researchCapabilityPath, writeRecordsPath } from './content'
import { Card, CardGrid, Shell } from './Shell'

type LookupMode = 'example' | 'live'

const EXAMPLE_ID = 'parent-authorized-capability'

function readQueryState(): { mode: LookupMode; ensName: string } {
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode') === 'live' ? 'live' : 'example'
  const ensName = params.get('name')?.trim() || ensRoot

  return { mode, ensName }
}

function writeQueryState(input: { mode: LookupMode; ensName: string }) {
  const params = new URLSearchParams()
  params.set('mode', input.mode)
  if (input.mode === 'live') {
    params.set('name', input.ensName)
  }

  const query = params.toString()
  const nextUrl = query ? `${discoverResearchPath}?${query}` : discoverResearchPath
  window.history.replaceState(null, '', nextUrl)
}

function ResultView({ result }: { result: DiscoverResearchResult }) {
  return (
    <>
      <CardGrid>
        <Card>
          <h2>Authority verdict</h2>
          <p>
            Status: <span className="code">{result.authorizationStatus}</span>
          </p>
          <p>{result.authorizationSummary}</p>
        </Card>
        <Card>
          <h2>Official endpoint</h2>
          <p>
            Declared: <span className="code">{result.officialEndpointDeclared ? 'yes' : 'no'}</span>
          </p>
          <p>
            Endpoint:{' '}
            <span className="code">{result.serviceUrl ?? '(none declared)'}</span>
          </p>
        </Card>
      </CardGrid>

      <section className="grid two">
        <article className="card">
          <h2>Structured result</h2>
          <pre className="result-block">{JSON.stringify(result, null, 2)}</pre>
        </article>
        <article className="card">
          <h2>Human-readable report</h2>
          <pre className="result-block">{renderDiscoverResearchResult(result)}</pre>
        </article>
      </section>
    </>
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

  async function runLookup(nextMode: LookupMode, nextEnsName: string) {
    setMode(nextMode)
    setEnsName(nextEnsName)
    setSourceTag(sourceTagForLookupMode(nextMode))
    writeQueryState({ mode: nextMode, ensName: nextEnsName })
    setIsLoading(true)
    setError(null)

    try {
      const nextResult = nextMode === 'example'
        ? resolveDiscoverResearchExampleResult(EXAMPLE_ID)
        : await resolveDiscoverResearchResultWithRpcUrls({
            parentName: nextEnsName,
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
      eyebrow="ÆNS consumer-first discovery"
      title="Discover the official research capability for an ENS identity"
      intro={
        <>
          This route turns the current ÆNS MVP into a public web surface: start from a root identity,
          discover the research capability, and inspect whether the endpoint is officially declared under
          parent authorization.
        </>
      }
      actions={
        <>
          <a className="button" href="../">
            Back to ÆNS landing
          </a>
          <a className="button" href={researchCapabilityPath}>
            Open research capability page
          </a>
          <a className="button" href={`${writeRecordsPath}?name=${encodeURIComponent(ensName)}`}>
            Open write-records UI
          </a>
          <a className="button" href={repoUrl}>
            View repo
          </a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Run the strong positive-path demo</h2>
          <p>
            This is the exact target state for the hackathon demo: a parent-authorized research capability with
            an official endpoint declared.
          </p>
          <button className="button" onClick={() => void runLookup('example', ensRoot)} type="button">
            Load deterministic positive path
          </button>
        </Card>
        <Card>
          <h2>Check current live ENS truth</h2>
          <p>
            Use the live lookup to inspect the current namespace honestly. Today this is useful because the
            deployed public page is live even though the live ENS publication is still incomplete.
          </p>
          <form
            className="lookup-form"
            onSubmit={(event) => {
              event.preventDefault()
              void runLookup('live', ensName)
            }}
          >
            <label className="label" htmlFor="ens-name">
              Root ENS name
            </label>
            <div className="input-row">
              <input
                id="ens-name"
                className="input"
                value={ensName}
                onChange={(event) => setEnsName(event.target.value)}
                placeholder="vitalik.eth"
              />
              <button className="button" type="submit">
                Run live lookup
              </button>
            </div>
          </form>
        </Card>
      </CardGrid>

      <section className="grid two">
        <article className="card">
          <h2>Current mode</h2>
          <p>
            Mode: <span className="code">{mode}</span>
          </p>
          <p>
            Data source: <span className="code">{sourceView.label}</span>
          </p>
          <p>
            Source tag: <span className="code">{sourceView.raw}</span>
          </p>
          <p>
            RPC fallbacks: <span className="code">{DEFAULT_RPC_URLS.length}</span>
          </p>
          <p>
            Liveness stays separate from authority here. The result can tell you that an endpoint is official
            without pretending it has been fully probed end-to-end.
          </p>
        </article>
        <article className="card">
          <h2>Why this route matters</h2>
          <ul className="list-tight">
            <li>judges can click a real consumer-first discovery surface</li>
            <li>the positive-path demo is stable and deterministic</li>
            <li>the live namespace can still be queried honestly</li>
            <li>the result is visible as both structured JSON and a human-readable report</li>
          </ul>
        </article>
      </section>

      {sourceView.warning ? (
        <section className="card">
          <h2>Source integrity warning</h2>
          <p>{sourceView.warning}</p>
          <p>Result display is fail-closed until a known source tag is restored.</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="card">
          <h2>Running lookup…</h2>
          <p>Querying the discovery path now.</p>
        </section>
      ) : null}

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
