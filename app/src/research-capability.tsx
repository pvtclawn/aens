import React, { useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { Card, CardGrid, Shell } from './Shell'
import { agentId, discoverResearchPath, ensResearch, ensRoot, notYetBullets, repoUrl, writeRecordsPath } from './content'

function readRootFromQuery(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('name')?.trim() || ensRoot
}

function deriveResearchName(rootEns: string): string {
  const [label, ...rest] = rootEns.split('.')
  if (!label || rest.length === 0) {
    return ensResearch
  }

  return `research.${rootEns}`
}

function toDiscoverHref(rootEns: string): string {
  const params = new URLSearchParams({ mode: 'live', name: rootEns })
  return `${discoverResearchPath}?${params.toString()}`
}

function ResearchCapabilityPage() {
  const rootEns = useMemo(() => readRootFromQuery(), [])
  const researchEns = useMemo(() => deriveResearchName(rootEns), [rootEns])

  return (
    <Shell
      eyebrow="ÆNS capability landing"
      title="Research Capability Route"
      intro={
        <>
          Planned capability surface for <span className="code">{researchEns}</span>, derived from root
          identity <span className="code">{rootEns}</span>.
        </>
      }
      actions={
        <>
          <a className="button" href="../">
            Back to ÆNS landing
          </a>
          <a className="button" href={toDiscoverHref(rootEns)}>
            Open discovery route
          </a>
          <a className="button" href={`${writeRecordsPath}?name=${encodeURIComponent(rootEns)}`}>
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
          <h2>Planned live authority path</h2>
          <ul className="list-tight">
            <li>
              root identity: <span className="code">{rootEns}</span>
            </li>
            <li>
              child capability: <span className="code">{researchEns}</span>
            </li>
            <li>
              expected authority result: <span className="code">parent-authorized</span>
            </li>
            <li>
              planned agent id: <span className="code">{agentId}</span>
            </li>
          </ul>
        </Card>
        <Card>
          <h2>What this page proves</h2>
          <ul className="list-tight">
            <li>the capability points to a real public page under project control</li>
            <li>the service surface is not a fake or dead placeholder</li>
            <li>the first live ÆNS proof has a cleaner landing than a raw source link</li>
          </ul>
        </Card>
      </CardGrid>

      <section className="grid two">
        <article className="card">
          <h2>What it does not prove</h2>
          <ul className="list-tight">
            {notYetBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="small">Those can be layered on after the first live proof.</p>
        </article>
        <article className="card">
          <h2>Why this exists</h2>
          <p>
            The first live ÆNS publication needs a credible landing surface. This page is the minimal app-shaped
            version of that surface, built in Vite/React so it can evolve instead of being thrown away.
          </p>
        </article>
      </section>
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ResearchCapabilityPage />
  </React.StrictMode>,
)
