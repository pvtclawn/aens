import React from 'react'
import ReactDOM from 'react-dom/client'
import { Card, CardGrid, Shell } from './Shell'
import { capabilityBullets, discoverResearchPath, ensResearch, ensRoot, repoUrl, researchCapabilityPath } from './content'

function HomePage() {
  return (
    <Shell
      eyebrow="ÆNS public landing"
      title="PrivateClawn on ÆNS"
      intro={
        <>
          ENS-native identity, discovery, and trust rails for autonomous agents. This is the landing surface
          for the PrivateClawn root identity and its first planned capability route.
        </>
      }
      actions={
        <>
          <a className="button" href={researchCapabilityPath}>
            Open research capability page
          </a>
          <a className="button" href={discoverResearchPath}>
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
          <h2>Root identity</h2>
          <p>
            Planned ENS root: <span className="code">{ensRoot}</span>
          </p>
          <p>
            Planned child capability: <span className="code">{ensResearch}</span>
          </p>
        </Card>
        <Card>
          <h2>What ÆNS is doing</h2>
          <ul className="list-tight">
            {capabilityBullets.map((item) => (
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
    <HomePage />
  </React.StrictMode>,
)
