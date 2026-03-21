#!/usr/bin/env bun
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  resolveDiscoverResearchExampleResult,
  resolveDiscoverResearchResult,
} from './discover-research'
import { fetchPublicProofState } from './public-proof-state'
import { DEFAULT_PUBLIC_BASE_URL, resolvePreferredPublicBaseUrl } from './public-surface'
import { buildDiscoverResearchArtifact } from './submission-artifacts'

const DEFAULT_EXAMPLE_ID = 'parent-authorized-capability'
const DEFAULT_LIVE_PARENT_NAME = 'pvtclawn.eth'

function repoRootFromModule(): string {
  return resolve(fileURLToPath(new URL('..', import.meta.url)))
}

function resolveGitCommit(repoRoot: string): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim()
}

async function main() {
  const repoRoot = repoRootFromModule()
  const artifactsDir = resolve(repoRoot, 'docs/submission/artifacts')
  const generatedAt = new Date().toISOString()
  const gitCommit = resolveGitCommit(repoRoot)
  const preferredBaseUrl = resolvePreferredPublicBaseUrl({
    envValue: process.env.AENS_PUBLIC_BASE_URL,
    defaultBaseUrl: DEFAULT_PUBLIC_BASE_URL,
  })
  const publicProofState = await fetchPublicProofState({
    preferredBaseUrl,
  })

  const exampleArtifact = buildDiscoverResearchArtifact({
    sourceMode: 'example',
    exampleId: DEFAULT_EXAMPLE_ID,
    generatedAt,
    gitCommit,
    command: 'bun run discover-research -- --example parent-authorized-capability --json',
    publicProofState,
    result: resolveDiscoverResearchExampleResult(DEFAULT_EXAMPLE_ID),
  })

  const liveArtifact = buildDiscoverResearchArtifact({
    sourceMode: 'live',
    generatedAt,
    gitCommit,
    command: 'bun run discover-research -- --json pvtclawn.eth',
    publicProofState,
    result: await resolveDiscoverResearchResult(DEFAULT_LIVE_PARENT_NAME),
  })

  mkdirSync(artifactsDir, { recursive: true })

  const examplePath = resolve(artifactsDir, 'discover-research-example.json')
  const livePath = resolve(artifactsDir, 'discover-research-live.json')

  writeFileSync(examplePath, `${JSON.stringify(exampleArtifact, null, 2)}\n`)
  writeFileSync(livePath, `${JSON.stringify(liveArtifact, null, 2)}\n`)

  console.log('ÆNS submission artifacts packaged')
  console.log(`- ${examplePath}`)
  console.log(`- ${livePath}`)
}

await main()
