import { resolve } from 'node:path'
import { DEFAULT_RESEARCH_CAPABILITY_URL, GITHUB_BLOB_STUB_URL } from './public-surface'

export const DEFAULT_PROOF_DIR = 'docs/proof/live-session'
export const DEFAULT_PROOF_PUBLICATION_MODE = 'bootstrap'

export const DEFAULT_SERVICE_URLS = {
  preferred: DEFAULT_RESEARCH_CAPABILITY_URL,
  bootstrap: GITHUB_BLOB_STUB_URL,
} as const

export type ProofPublicationMode = keyof typeof DEFAULT_SERVICE_URLS

export interface ProofCaptureConfigInput {
  label: string
  timestamp: string
  repoRoot: string
  repoCommit: string
  outDir?: string
  publicationMode?: string
  serviceUrl?: string
}

export interface ResolvedProofCaptureConfig {
  label: string
  safeLabel: string
  timestamp: string
  repoRoot: string
  repoCommit: string
  outDir: string
  outFile: string
  publicationMode: ProofPublicationMode
  serviceUrl: string
}

export class ProofCaptureConfigError extends Error {}

export function sanitizeProofLabel(label: string): string {
  const withoutSpaces = label.trim().replace(/\s+/g, '-')
  const safeLabel = withoutSpaces.replace(/[^A-Za-z0-9_-]/g, '')
  return safeLabel.length > 0 ? safeLabel : 'capture'
}

export function resolveProofPublicationMode(value?: string): ProofPublicationMode {
  const trimmed = value?.trim()
  if (!trimmed) {
    return DEFAULT_PROOF_PUBLICATION_MODE
  }

  if (trimmed === 'preferred' || trimmed === 'bootstrap') {
    return trimmed
  }

  throw new ProofCaptureConfigError(
    `Unsupported publication mode: ${trimmed}. Use \`preferred\` or \`bootstrap\`.`,
  )
}

export function normalizeServiceUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new ProofCaptureConfigError('Service URL must not be empty.')
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new ProofCaptureConfigError(`Service URL must be an absolute URL: ${trimmed}`)
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new ProofCaptureConfigError(`Service URL must use http or https: ${trimmed}`)
  }

  return parsed.toString()
}

export function resolveProofServiceUrl(input: {
  publicationMode: ProofPublicationMode
  serviceUrl?: string
}): string {
  if (input.serviceUrl?.trim()) {
    return normalizeServiceUrl(input.serviceUrl)
  }

  return DEFAULT_SERVICE_URLS[input.publicationMode]
}

export function resolveProofOutputDir(repoRoot: string, outDir?: string): string {
  const trimmed = outDir?.trim()
  if (!trimmed) {
    return resolve(repoRoot, DEFAULT_PROOF_DIR)
  }

  return resolve(repoRoot, trimmed)
}

export function resolveProofCaptureConfig(input: ProofCaptureConfigInput): ResolvedProofCaptureConfig {
  const publicationMode = resolveProofPublicationMode(input.publicationMode)
  const safeLabel = sanitizeProofLabel(input.label)
  const outDir = resolveProofOutputDir(input.repoRoot, input.outDir)
  const serviceUrl = resolveProofServiceUrl({
    publicationMode,
    serviceUrl: input.serviceUrl,
  })

  return {
    label: input.label,
    safeLabel,
    timestamp: input.timestamp,
    repoRoot: input.repoRoot,
    repoCommit: input.repoCommit,
    outDir,
    outFile: resolve(outDir, `${input.timestamp}--${safeLabel}.md`),
    publicationMode,
    serviceUrl,
  }
}

export function buildProofCaptureHeader(config: ResolvedProofCaptureConfig): string {
  return [
    `# ÆNS live proof capture — ${config.label}`,
    '',
    `- Captured: \`${config.timestamp}\``,
    `- Publication mode: \`${config.publicationMode}\``,
    `- Service URL: \`${config.serviceUrl}\``,
    `- Repo commit: \`${config.repoCommit}\``,
    `- Working directory: \`${config.repoRoot}\``,
    '',
  ].join('\n')
}

export function buildCommandSection(input: {
  title: string
  exitCode: number
  output: string
}): string {
  return [
    `## ${input.title}`,
    '',
    `- Exit code: \`${input.exitCode}\``,
    '',
    '```text',
    input.output,
    '```',
    '',
  ].join('\n')
}
