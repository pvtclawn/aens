#!/usr/bin/env bun
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  classifyCapabilityAuthorization,
  type CapabilityAuthorization,
} from './capability-authorization'
import { type AensResolvedProfile } from './profile'
import { DEFAULT_PROOF_DIR } from './proof-capture'
import {
  fetchPublicProofState,
  summarizePublicProofStateLines,
  type PublicProofState,
} from './public-proof-state'
import {
  DEFAULT_RESEARCH_CAPABILITY_URL,
  resolvePreferredPublicBaseUrl,
} from './public-surface'
import { resolveAensProfile } from './resolver'

export const DEFAULT_PUBLISH_ROOT_NAME = 'pvtclawn.eth'
export const DEFAULT_PUBLISH_CHILD_NAME = 'research.pvtclawn.eth'

export type PublishAssistState =
  | 'preflight-ready'
  | 'root-needs-write'
  | 'root-verified'
  | 'child-needs-create-or-write'
  | 'child-verified-provisional'
  | 'needs-parent-authorization'
  | 'parent-authorized-verified'
  | 'proof-captured'
  | 'needs-operator-reconcile'
  | 'aborted'

export interface PublishAssistCliOptions {
  rootName: string
  childName: string
  proofDir?: string
}

export class PublishAssistUsageError extends Error {}

export interface PublishAssistObservedProfile {
  profile: AensResolvedProfile | null
  error: string | null
}

export interface PublishAssistSnapshot {
  rootName: string
  childName: string
  expectedServiceUrl: string
  proofDir: string
  root: PublishAssistObservedProfile
  child: PublishAssistObservedProfile
  publicProofState: PublicProofState | null
  publicProofStateError: string | null
  capabilityAuthorization: CapabilityAuthorization | null
  proofArtifactPaths: string[]
}

export interface PublishAssistResult {
  rootName: string
  childName: string
  proofDir: string
  expectedServiceUrl: string
  state: PublishAssistState
  summary: string
  nextLegalStep: string
  humanReviewRequired: string[]
  followUpVerificationCommands: string[]
  evidenceLines: string[]
}

function repoRootFromModule(): string {
  return resolve(fileURLToPath(new URL('..', import.meta.url)))
}

function hasValue(value: string | null | undefined): boolean {
  return Boolean(value && value.trim())
}

function normalizeEnsName(name: string): string {
  return name.trim().toLowerCase()
}

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

function getObservedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function observeProfile(profilePromise: Promise<AensResolvedProfile>): Promise<PublishAssistObservedProfile> {
  return profilePromise
    .then((profile) => ({ profile, error: null }))
    .catch((error: unknown) => ({ profile: null, error: getObservedErrorMessage(error) }))
}

function missingRootFields(profile: AensResolvedProfile | null): string[] {
  if (!profile) {
    return ['address', 'description', 'agentId', 'runtime']
  }

  const missing: string[] = []
  if (!hasValue(profile.address)) {
    missing.push('address')
  }
  if (!hasValue(profile.records.description)) {
    missing.push('description')
  }
  if (!hasValue(profile.records.agentId)) {
    missing.push('agentId')
  }
  if (!hasValue(profile.records.runtime)) {
    missing.push('runtime')
  }
  return missing
}

function missingChildFields(input: {
  profile: AensResolvedProfile | null
  expectedParentName: string
  expectedServiceUrl: string
}): string[] {
  const { profile, expectedParentName, expectedServiceUrl } = input
  if (!profile) {
    return ['address', 'description', 'parentName', 'agentId', 'runtime', 'serviceUrl']
  }

  const missing: string[] = []
  if (!hasValue(profile.address)) {
    missing.push('address')
  }
  if (!hasValue(profile.records.description)) {
    missing.push('description')
  }
  if (!hasValue(profile.records.parentName)) {
    missing.push('parentName')
  } else if (normalizeEnsName(profile.records.parentName!) !== normalizeEnsName(expectedParentName)) {
    missing.push(`parentName!=${expectedParentName}`)
  }
  if (!hasValue(profile.records.agentId)) {
    missing.push('agentId')
  }
  if (!hasValue(profile.records.runtime)) {
    missing.push('runtime')
  }
  if (!hasValue(profile.records.serviceUrl)) {
    missing.push('serviceUrl')
  } else if (normalizeUrl(profile.records.serviceUrl!) !== normalizeUrl(expectedServiceUrl)) {
    missing.push(`serviceUrl!=${expectedServiceUrl}`)
  }
  return missing
}

function hasAnyRootPublishProgress(profile: AensResolvedProfile | null): boolean {
  if (!profile) {
    return false
  }

  return Boolean(
    hasValue(profile.address)
      || hasValue(profile.records.description)
      || hasValue(profile.records.agentId)
      || hasValue(profile.records.runtime)
      || (profile.records.capabilities?.length ?? 0) > 0,
  )
}

function hasAnyChildPublishProgress(profile: AensResolvedProfile | null): boolean {
  if (!profile) {
    return false
  }

  return Boolean(
    hasValue(profile.address)
      || hasValue(profile.records.description)
      || hasValue(profile.records.parentName)
      || hasValue(profile.records.agentId)
      || hasValue(profile.records.runtime)
      || hasValue(profile.records.serviceUrl),
  )
}

function rootIsReady(profile: AensResolvedProfile | null): boolean {
  return missingRootFields(profile).length === 0
}

function childIsReady(input: {
  profile: AensResolvedProfile | null
  expectedParentName: string
  expectedServiceUrl: string
}): boolean {
  return missingChildFields(input).length === 0
}

function detectReconcileReasons(input: {
  snapshot: PublishAssistSnapshot
  rootReady: boolean
}): string[] {
  const { snapshot, rootReady } = input
  const reasons: string[] = []

  if (snapshot.publicProofStateError) {
    reasons.push(`public truth read failed: ${snapshot.publicProofStateError}`)
  }

  if (!snapshot.publicProofState?.preferredSurfaceReady) {
    reasons.push('preferred public surface is not ready for the preferred-mode publish path')
  }

  if (snapshot.root.error) {
    reasons.push(`root read failed: ${snapshot.root.error}`)
  }

  if (snapshot.child.error) {
    reasons.push(`child read failed: ${snapshot.child.error}`)
  }

  if (snapshot.child.profile && !rootReady && hasAnyChildPublishProgress(snapshot.child.profile)) {
    reasons.push('child has publish progress before the root is fully verified')
  }

  if (
    snapshot.child.profile?.records.parentName
    && normalizeEnsName(snapshot.child.profile.records.parentName) !== normalizeEnsName(snapshot.rootName)
  ) {
    reasons.push(`child declares unexpected parent ${snapshot.child.profile.records.parentName}`)
  }

  if (
    snapshot.child.profile?.records.serviceUrl
    && normalizeUrl(snapshot.child.profile.records.serviceUrl) !== normalizeUrl(snapshot.expectedServiceUrl)
  ) {
    reasons.push(`child declares unexpected service URL ${snapshot.child.profile.records.serviceUrl}`)
  }

  if (
    snapshot.root.profile?.records.agentId
    && snapshot.child.profile?.records.agentId
    && snapshot.root.profile.records.agentId !== snapshot.child.profile.records.agentId
  ) {
    reasons.push('root and child agent IDs disagree')
  }

  if (snapshot.capabilityAuthorization?.status === 'identity-mismatch') {
    reasons.push(snapshot.capabilityAuthorization.summary)
  }

  return reasons
}

function humanReviewChecks(input: {
  targetName: string
  targetKind: string
}): string[] {
  return [
    'confirm the wrapped-owner wallet is connected',
    `confirm the wallet/UI targets ${input.targetName} (${input.targetKind})`,
    'confirm there is no suspicious gas / contract / UI mismatch before approving',
  ]
}

function buildCaptureCommand(label: string, expectedServiceUrl: string): string {
  return `AENS_PROOF_PUBLICATION_MODE=preferred AENS_PROOF_SERVICE_URL=${expectedServiceUrl} bun run capture-proof -- ${label}`
}

function listMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return []
  }

  const entries = readdirSync(dir)
  const paths: string[] = []
  for (const entry of entries) {
    const path = resolve(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      paths.push(...listMarkdownFiles(path))
      continue
    }

    if (stat.isFile() && path.endsWith('.md')) {
      paths.push(path)
    }
  }

  return paths
}

function findProofArtifacts(input: {
  proofDir: string
  childName: string
}): string[] {
  return listMarkdownFiles(input.proofDir).filter((path) => {
    const body = readFileSync(path, 'utf8')
    return body.includes('## Public truth snapshot') && body.includes(input.childName)
  })
}

export function parsePublishAssistArgs(args: string[]): PublishAssistCliOptions {
  let rootName = DEFAULT_PUBLISH_ROOT_NAME
  let childName = DEFAULT_PUBLISH_CHILD_NAME
  let proofDir: string | undefined

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--root-name') {
      const next = args[index + 1]
      if (!next || next.startsWith('--')) {
        throw new PublishAssistUsageError('Missing ENS name after --root-name')
      }
      rootName = next
      index += 1
      continue
    }

    if (arg === '--child-name') {
      const next = args[index + 1]
      if (!next || next.startsWith('--')) {
        throw new PublishAssistUsageError('Missing ENS name after --child-name')
      }
      childName = next
      index += 1
      continue
    }

    if (arg === '--proof-dir') {
      const next = args[index + 1]
      if (!next || next.startsWith('--')) {
        throw new PublishAssistUsageError('Missing directory after --proof-dir')
      }
      proofDir = next
      index += 1
      continue
    }

    throw new PublishAssistUsageError(`Unknown argument: ${arg}`)
  }

  return {
    rootName,
    childName,
    proofDir,
  }
}

export function derivePublishAssistResult(snapshot: PublishAssistSnapshot): PublishAssistResult {
  const rootProfile = snapshot.root.profile
  const childProfile = snapshot.child.profile
  const rootReady = rootIsReady(rootProfile)
  const childReady = childIsReady({
    profile: childProfile,
    expectedParentName: snapshot.rootName,
    expectedServiceUrl: snapshot.expectedServiceUrl,
  })
  const rootMissing = missingRootFields(rootProfile)
  const childMissing = missingChildFields({
    profile: childProfile,
    expectedParentName: snapshot.rootName,
    expectedServiceUrl: snapshot.expectedServiceUrl,
  })
  const reconcileReasons = detectReconcileReasons({
    snapshot,
    rootReady,
  })
  const evidenceLines = [
    `Preferred public surface ready: ${snapshot.publicProofState?.preferredSurfaceReady ? 'yes' : 'no'}`,
    `Root publish fields complete: ${rootReady ? 'yes' : 'no'}`,
    rootMissing.length > 0 ? `Root publish fields missing: ${rootMissing.join(', ')}` : 'Root publish fields missing: none',
    `Child publish fields complete: ${childReady ? 'yes' : 'no'}`,
    childMissing.length > 0 ? `Child publish fields missing: ${childMissing.join(', ')}` : 'Child publish fields missing: none',
    `Capability authorization: ${snapshot.capabilityAuthorization?.status ?? 'unknown'}`,
    `Proof artifact detected: ${snapshot.proofArtifactPaths.length > 0 ? 'yes' : 'no'}`,
  ]

  if (reconcileReasons.length > 0) {
    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state: 'needs-operator-reconcile',
      summary: 'Observed truth is contradictory or incomplete for a safe next write.',
      nextLegalStep: 'Stop and reconcile the current ENS/public state before approving any write.',
      humanReviewRequired: [],
      followUpVerificationCommands: [
        `bun run inspect ${snapshot.rootName}`,
        `bun run inspect ${snapshot.childName}`,
        'bun run check-public-surface',
      ],
      evidenceLines: [
        ...evidenceLines,
        ...reconcileReasons.map((reason) => `Reconcile reason: ${reason}`),
      ],
    }
  }

  if (!hasAnyRootPublishProgress(rootProfile)) {
    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state: 'preflight-ready',
      summary: 'Preflight checks are clean and the first legal write is the root publish step.',
      nextLegalStep: `Write the root resolver + root publish records for ${snapshot.rootName}.`,
      humanReviewRequired: humanReviewChecks({
        targetName: snapshot.rootName,
        targetKind: 'root ENS write',
      }),
      followUpVerificationCommands: [
        `bun run inspect ${snapshot.rootName}`,
        buildCaptureCommand('post-root', snapshot.expectedServiceUrl),
      ],
      evidenceLines,
    }
  }

  if (!rootReady) {
    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state: 'root-needs-write',
      summary: 'Root publish records are partially configured and must be completed before child work.',
      nextLegalStep: `Finish the root publish records for ${snapshot.rootName}.`,
      humanReviewRequired: humanReviewChecks({
        targetName: snapshot.rootName,
        targetKind: 'root ENS write',
      }),
      followUpVerificationCommands: [
        `bun run inspect ${snapshot.rootName}`,
        buildCaptureCommand('post-root', snapshot.expectedServiceUrl),
      ],
      evidenceLines,
    }
  }

  if (!hasAnyChildPublishProgress(childProfile)) {
    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state: 'root-verified',
      summary: 'The root is verified and the child publish step is the next legal move.',
      nextLegalStep: `Create ${snapshot.childName} and write its child publish records.`,
      humanReviewRequired: humanReviewChecks({
        targetName: snapshot.childName,
        targetKind: 'child ENS create/write',
      }),
      followUpVerificationCommands: [
        `bun run inspect ${snapshot.childName}`,
      ],
      evidenceLines,
    }
  }

  if (!childReady) {
    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state: 'child-needs-create-or-write',
      summary: 'The child exists partially or incompletely and needs a clean child write before authority can finalize.',
      nextLegalStep: `Complete the child publish records for ${snapshot.childName}.`,
      humanReviewRequired: humanReviewChecks({
        targetName: snapshot.childName,
        targetKind: 'child ENS write',
      }),
      followUpVerificationCommands: [
        `bun run inspect ${snapshot.childName}`,
      ],
      evidenceLines,
    }
  }

  if (snapshot.capabilityAuthorization?.status === 'parent-authorized') {
    if (snapshot.proofArtifactPaths.length > 0) {
      return {
        rootName: snapshot.rootName,
        childName: snapshot.childName,
        proofDir: snapshot.proofDir,
        expectedServiceUrl: snapshot.expectedServiceUrl,
        state: 'proof-captured',
        summary: 'Parent authorization is verified and proof capture artifacts are already present.',
        nextLegalStep: 'No further write is required. Review the captured proof artifacts and the note draft.',
        humanReviewRequired: [],
        followUpVerificationCommands: [],
        evidenceLines: [
          ...evidenceLines,
          ...snapshot.proofArtifactPaths.map((path) => `Proof artifact: ${path}`),
        ],
      }
    }

    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state: 'parent-authorized-verified',
      summary: 'Parent authorization is verified and the remaining legal step is final proof capture.',
      nextLegalStep: 'Capture the final proof artifact for the now-authorized publish state.',
      humanReviewRequired: [],
      followUpVerificationCommands: [
        'bun run check-public-surface',
        buildCaptureCommand('final', snapshot.expectedServiceUrl),
      ],
      evidenceLines,
    }
  }

  if (snapshot.capabilityAuthorization?.status === 'unlisted-child') {
    const state: PublishAssistState = (rootProfile?.records.capabilities?.length ?? 0) > 0
      ? 'needs-parent-authorization'
      : 'child-verified-provisional'

    return {
      rootName: snapshot.rootName,
      childName: snapshot.childName,
      proofDir: snapshot.proofDir,
      expectedServiceUrl: snapshot.expectedServiceUrl,
      state,
      summary: 'The child is verified provisionally, but the parent has not yet authorized it.',
      nextLegalStep: `Write the parent capability authorization on ${snapshot.rootName} so it explicitly lists ${snapshot.childName}.`,
      humanReviewRequired: humanReviewChecks({
        targetName: snapshot.rootName,
        targetKind: 'parent capability authorization write',
      }),
      followUpVerificationCommands: [
        `bun run inspect ${snapshot.rootName}`,
        `bun run inspect ${snapshot.childName}`,
        'bun run check-public-surface',
        buildCaptureCommand('final', snapshot.expectedServiceUrl),
      ],
      evidenceLines,
    }
  }

  return {
    rootName: snapshot.rootName,
    childName: snapshot.childName,
    proofDir: snapshot.proofDir,
    expectedServiceUrl: snapshot.expectedServiceUrl,
    state: 'aborted',
    summary: 'The publish state could not be advanced safely from the observed evidence.',
    nextLegalStep: 'Abort this session and restart from a fresh read of root, child, and public truth.',
    humanReviewRequired: [],
    followUpVerificationCommands: [
      `bun run inspect ${snapshot.rootName}`,
      `bun run inspect ${snapshot.childName}`,
      'bun run check-public-surface',
    ],
    evidenceLines,
  }
}

export function renderPublishAssistResult(result: PublishAssistResult): string {
  const lines = [
    'ÆNS publisher assist v1',
    '',
    `Root name: ${result.rootName}`,
    `Child name: ${result.childName}`,
    `Expected service URL: ${result.expectedServiceUrl}`,
    `Proof directory: ${result.proofDir}`,
    `Current publish state: ${result.state}`,
    '',
    `Summary: ${result.summary}`,
    '',
    'Next legal step:',
    `- ${result.nextLegalStep}`,
    '',
    'Evidence snapshot:',
    ...result.evidenceLines.map((line) => `- ${line}`),
  ]

  if (result.humanReviewRequired.length > 0) {
    lines.push('', 'Human review required before write:')
    lines.push(...result.humanReviewRequired.map((line) => `- ${line}`))
  }

  if (result.followUpVerificationCommands.length > 0) {
    lines.push('', 'After the step, run:')
    lines.push(...result.followUpVerificationCommands.map((command) => `- ${command}`))
  }

  return lines.join('\n')
}

export async function resolvePublishAssistSnapshot(input: {
  rootName?: string
  childName?: string
  proofDir?: string
  repoRoot?: string
  expectedServiceUrl?: string
  publicBaseUrlEnv?: string
} = {}): Promise<PublishAssistSnapshot> {
  const repoRoot = input.repoRoot ?? repoRootFromModule()
  const rootName = input.rootName ?? DEFAULT_PUBLISH_ROOT_NAME
  const childName = input.childName ?? DEFAULT_PUBLISH_CHILD_NAME
  const proofDir = resolve(repoRoot, input.proofDir ?? DEFAULT_PROOF_DIR)
  const expectedServiceUrl = input.expectedServiceUrl ?? DEFAULT_RESEARCH_CAPABILITY_URL
  const preferredBaseUrl = resolvePreferredPublicBaseUrl({
    envValue: input.publicBaseUrlEnv,
  })

  const [root, child, publicProofStateResult] = await Promise.all([
    observeProfile(resolveAensProfile({ ensName: rootName })),
    observeProfile(resolveAensProfile({ ensName: childName })),
    fetchPublicProofState({ preferredBaseUrl })
      .then((state) => ({ state, error: null }))
      .catch((error: unknown) => ({ state: null, error: getObservedErrorMessage(error) })),
  ])

  const capabilityAuthorization = root.profile && child.profile
    ? classifyCapabilityAuthorization({
      profile: child.profile,
      parentProfile: root.profile,
    })
    : null

  const proofArtifactPaths = findProofArtifacts({
    proofDir,
    childName,
  })

  return {
    rootName,
    childName,
    expectedServiceUrl,
    proofDir,
    root,
    child,
    publicProofState: publicProofStateResult.state,
    publicProofStateError: publicProofStateResult.error,
    capabilityAuthorization,
    proofArtifactPaths,
  }
}

function usageText(): string {
  return [
    'Usage: bun run src/publish-assist.ts [--root-name <ens-name>] [--child-name <ens-name>] [--proof-dir <dir>]',
    '',
    `Defaults: --root-name ${DEFAULT_PUBLISH_ROOT_NAME} --child-name ${DEFAULT_PUBLISH_CHILD_NAME}`,
  ].join('\n')
}

export async function runPublishAssistCli(
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
  io: { log(message: string): void; error(message: string): void } = {
    log: (message) => console.log(message),
    error: (message) => console.error(message),
  },
): Promise<number> {
  let options: PublishAssistCliOptions
  try {
    options = parsePublishAssistArgs(args)
  } catch (error) {
    if (error instanceof PublishAssistUsageError) {
      io.error(`${error.message}\n\n${usageText()}`)
      return 1
    }
    throw error
  }

  const snapshot = await resolvePublishAssistSnapshot({
    rootName: options.rootName,
    childName: options.childName,
    proofDir: options.proofDir ?? env.AENS_PROOF_DIR,
    publicBaseUrlEnv: env.AENS_PUBLIC_BASE_URL,
  })
  const result = derivePublishAssistResult(snapshot)

  io.log(renderPublishAssistResult(result))
  return result.state === 'needs-operator-reconcile' || result.state === 'aborted' ? 2 : 0
}

function isMainInvocation(): boolean {
  const invokedPath = process.argv[1] ?? ''
  return (
    invokedPath === 'src/publish-assist.ts'
    || invokedPath.endsWith('/src/publish-assist.ts')
    || invokedPath.endsWith('\\src\\publish-assist.ts')
  )
}

if (isMainInvocation()) {
  runPublishAssistCli(process.argv.slice(2))
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error) => {
      console.error('ÆNS publisher assist failed:', error)
      process.exit(1)
    })
}

export function summarizePublishAssistPublicTruth(snapshot: PublishAssistSnapshot): string[] {
  if (!snapshot.publicProofState) {
    return snapshot.publicProofStateError ? [snapshot.publicProofStateError] : ['public truth unavailable']
  }

  return summarizePublicProofStateLines(snapshot.publicProofState)
}
