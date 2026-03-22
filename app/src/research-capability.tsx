import React, { useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { Card, CardGrid, Shell } from './Shell'
import { agentId, ensResearch, ensRoot, notYetBullets, repoUrl } from './content'
import { buildRouteLinks, normalizeEnsName } from './route-links'

function readRootFromQuery(): string {
  const params = new URLSearchParams(window.location.search)
  return normalizeEnsName(params.get('name') ?? ensRoot)
}

function deriveResearchName(rootEns: string): string {
  if (!rootEns.includes('.')) {
    return ensResearch
  }

  return `research.${rootEns}`
}

function ResearchCapabilityPage() {
  const rootEns = useMemo(() => readRootFromQuery(), [])
  const researchEns = useMemo(() => deriveResearchName(rootEns), [rootEns])
  const links = buildRouteLinks(rootEns)

  return (
    <Shell
      eyebrow="ÆNS"
      title="Research Capability"
      intro={<>Capability page derived from root identity <span className="code">{rootEns}</span>.</>}
      actions={
        <>
          <a className="button" href={links.landing}>Root explorer</a>
          <a className="button" href={links.discover}>Discovery</a>
          <a className="button" href={links.writeRecords}>Write records</a>
          <a className="button" href={repoUrl}>Repo</a>
        </>
      }
    >
      <CardGrid>
        <Card>
          <h2>Current model</h2>
          <p>Root: <span className="code">{rootEns}</span></p>
          <p>Capability: <span className="code">{researchEns}</span></p>
          <p>Expected authority: <span className="code">parent-authorized</span></p>
          <p>Agent id: <span className="code">{agentId}</span></p>
        </Card>

        <Card>
          <h2>Not in scope yet</h2>
          <ul className="list-tight">
            {notYetBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </CardGrid>
    </Shell>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ResearchCapabilityPage />
  </React.StrictMode>,
)
