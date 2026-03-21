#!/usr/bin/env bun
import { classifyCapabilityAuthorization } from './capability-authorization'
import { getExampleScenario } from './examples'
import { type AensResolvedProfile } from './profile'
import { resolveAensProfile, resolveAensProfileWithRpcUrls } from './resolver'

export interface DiscoverResearchCliOptions {
  parentName: string | null
  exampleId: string | null
  json: boolean
}

export class DiscoverResearchUsageError extends Error {}

export interface DiscoverResearchObservedProfile {
  profile: AensResolvedProfile | null
  error: string | null
}

export interface DiscoverResearchResult {
  parentName: string
  researchCapabilityName: string
  authorizationStatus: string
  authorizationSummary: string
  parentListsChild: boolean
  childDeclaresParent: boolean
  serviceUrl: string | null
  officialEndpointDeclared: boolean
  livenessChecked: boolean
  notes: string[]
}

function normalizeEnsName(name: string): string {
  return name.trim().toLowerCase()
}

function getObservedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function observeProfile(profilePromise: Promise<AensResolvedProfile>): Promise<DiscoverResearchObservedProfile> {
  return profilePromise
    .then((profile) => ({ profile, error: null }))
    .catch((error: unknown) => ({ profile: null, error: getObservedErrorMessage(error) }))
}

export function parseDiscoverResearchArgs(args: string[]): DiscoverResearchCliOptions {
  let parentName: string | null = null
  let exampleId: string | null = null
  let json = false

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--json') {
      json = true
      continue
    }

    if (arg === '--example') {
      const next = args[index + 1]
      if (!next || next.startsWith('--')) {
        throw new DiscoverResearchUsageError('Missing example id after --example')
      }
      exampleId = next
      index += 1
      continue
    }

    if (arg.startsWith('--example=')) {
      exampleId = arg.slice('--example='.length)
      if (!exampleId) {
        throw new DiscoverResearchUsageError('Missing example id after --example=')
      }
      continue
    }

    if (arg.startsWith('--')) {
      throw new DiscoverResearchUsageError(`Unknown argument: ${arg}`)
    }

    if (parentName) {
      throw new DiscoverResearchUsageError(`Unexpected extra argument: ${arg}`)
    }

    parentName = arg
  }

  if (exampleId && parentName) {
    throw new DiscoverResearchUsageError('Choose either a parent ENS name or --example, not both')
  }

  if (!exampleId && !parentName) {
    throw new DiscoverResearchUsageError('Provide a parent ENS name or --example <id>')
  }

  return {
    parentName,
    exampleId,
    json,
  }
}

export function deriveResearchCapabilityName(parentName: string, parentProfile?: AensResolvedProfile | null): string {
  const normalizedParent = normalizeEnsName(parentName)
  const expected = `research.${normalizedParent}`
  const capabilities = parentProfile?.records.capabilities ?? []

  const exactMatch = capabilities.find((capability) => normalizeEnsName(capability) === expected)
  if (exactMatch) {
    return exactMatch
  }

  const labelMatch = capabilities.find((capability) =>
    normalizeEnsName(capability).startsWith(`research.`),
  )
  if (labelMatch) {
    return labelMatch
  }

  return expected
}

export function deriveDiscoverResearchResult(input: {
  parentName: string
  parent: DiscoverResearchObservedProfile
  child: DiscoverResearchObservedProfile
  researchCapabilityName?: string
}): DiscoverResearchResult {
  const parentName = normalizeEnsName(input.parentName)
  const researchCapabilityName = input.researchCapabilityName
    ? normalizeEnsName(input.researchCapabilityName)
    : deriveResearchCapabilityName(parentName, input.parent.profile)

  const parentProfile = input.parent.profile
  const childProfile = input.child.profile
  const authorization = parentProfile && childProfile
    ? classifyCapabilityAuthorization({
      profile: childProfile,
      parentProfile,
    })
    : null

  const parentListsChild = Boolean(
    parentProfile?.records.capabilities?.some(
      (capability) => normalizeEnsName(capability) === researchCapabilityName,
    ),
  )
  const childDeclaresParent = normalizeEnsName(childProfile?.records.parentName ?? '') === parentName
  const serviceUrl = childProfile?.records.serviceUrl ?? null
  const notes: string[] = []

  if (input.parent.error) {
    notes.push(`parent read failed: ${input.parent.error}`)
  }

  if (input.child.error) {
    notes.push(`research capability read failed: ${input.child.error}`)
  }

  if (!serviceUrl) {
    notes.push('research capability does not currently declare a service URL')
  }

  if (!childDeclaresParent && childProfile) {
    notes.push('research capability does not currently point back to the parent identity')
  }

  if (!parentListsChild && parentProfile) {
    notes.push('parent identity does not currently list the research capability')
  }

  let authorizationStatus = 'unresolved'
  let authorizationSummary = 'Could not verify the official research capability yet.'

  if (authorization) {
    authorizationStatus = authorization.status
    authorizationSummary = authorization.summary
  } else if (!childProfile) {
    authorizationStatus = 'missing-child'
    authorizationSummary = 'No readable research capability was found for this parent ENS identity.'
  } else if (!parentProfile) {
    authorizationStatus = 'missing-parent'
    authorizationSummary = 'Could not read the parent ENS identity, so authorization cannot be confirmed.'
  }

  const officialEndpointDeclared = authorizationStatus === 'parent-authorized' && Boolean(serviceUrl)

  if (officialEndpointDeclared) {
    notes.push('official research endpoint is declared under parent authorization, but liveness still needs to be checked separately if required')
  }

  return {
    parentName,
    researchCapabilityName,
    authorizationStatus,
    authorizationSummary,
    parentListsChild,
    childDeclaresParent,
    serviceUrl,
    officialEndpointDeclared,
    livenessChecked: false,
    notes,
  }
}

export function renderDiscoverResearchResult(result: DiscoverResearchResult): string {
  const lines = [
    'ÆNS discover-research',
    '',
    `Parent ENS identity: ${result.parentName}`,
    `Research capability: ${result.researchCapabilityName}`,
    `Authorization status: ${result.authorizationStatus}`,
    `Authorization summary: ${result.authorizationSummary}`,
    `Parent lists child: ${result.parentListsChild ? 'yes' : 'no'}`,
    `Child declares parent: ${result.childDeclaresParent ? 'yes' : 'no'}`,
    `Official research endpoint: ${result.serviceUrl ?? '(none declared)'}`,
    `Official endpoint declared: ${result.officialEndpointDeclared ? 'yes' : 'no'}`,
    `Liveness checked: ${result.livenessChecked ? 'yes' : 'no'}`,
  ]

  if (result.officialEndpointDeclared && result.serviceUrl) {
    lines.push('', 'Next action:', `- Open or verify: ${result.serviceUrl}`)
  }

  if (result.notes.length > 0) {
    lines.push('', 'Notes:')
    lines.push(...result.notes.map((note) => `- ${note}`))
  }

  return lines.join('\n')
}

export async function resolveDiscoverResearchResultWithRpcUrls(input: {
  parentName: string
  rpcUrls: readonly string[]
}): Promise<DiscoverResearchResult> {
  const normalizedParent = normalizeEnsName(input.parentName)
  const parent = await observeProfile(resolveAensProfileWithRpcUrls({
    ensName: normalizedParent,
    rpcUrls: input.rpcUrls,
  }))
  const researchCapabilityName = deriveResearchCapabilityName(normalizedParent, parent.profile)
  const child = await observeProfile(resolveAensProfileWithRpcUrls({
    ensName: researchCapabilityName,
    rpcUrls: input.rpcUrls,
  }))

  return deriveDiscoverResearchResult({
    parentName: normalizedParent,
    parent,
    child,
    researchCapabilityName,
  })
}

export async function resolveDiscoverResearchResult(parentName: string): Promise<DiscoverResearchResult> {
  const normalizedParent = normalizeEnsName(parentName)
  const parent = await observeProfile(resolveAensProfile({ ensName: normalizedParent }))
  const researchCapabilityName = deriveResearchCapabilityName(normalizedParent, parent.profile)
  const child = await observeProfile(resolveAensProfile({ ensName: researchCapabilityName }))

  return deriveDiscoverResearchResult({
    parentName: normalizedParent,
    parent,
    child,
    researchCapabilityName,
  })
}

export function resolveDiscoverResearchExampleResult(exampleId: string): DiscoverResearchResult {
  const scenario = getExampleScenario(exampleId)
  if (!scenario) {
    throw new DiscoverResearchUsageError(`Unknown example id: ${exampleId}`)
  }

  if (!scenario.parentProfile) {
    throw new DiscoverResearchUsageError(`Example ${exampleId} does not include a parent profile`)
  }

  const researchCapabilityName = normalizeEnsName(scenario.profile.ensName)
  if (!researchCapabilityName.startsWith('research.')) {
    throw new DiscoverResearchUsageError(`Example ${exampleId} is not a research capability example`)
  }

  return deriveDiscoverResearchResult({
    parentName: scenario.parentProfile.ensName,
    parent: { profile: scenario.parentProfile, error: null },
    child: { profile: scenario.profile, error: null },
    researchCapabilityName,
  })
}

function usageText(): string {
  return [
    'Usage: bun run discover-research -- <parent-ens-name> [--json]',
    '   or: bun run discover-research -- --example <id> [--json]',
    '',
    'Examples:',
    '  bun run discover-research -- pvtclawn.eth',
    '  bun run discover-research -- --example parent-authorized-capability',
  ].join('\n')
}

export async function runDiscoverResearchCli(
  args: string[],
  io: { log(message: string): void; error(message: string): void } = {
    log: (message) => console.log(message),
    error: (message) => console.error(message),
  },
): Promise<number> {
  let options: DiscoverResearchCliOptions
  try {
    options = parseDiscoverResearchArgs(args)
  } catch (error) {
    if (error instanceof DiscoverResearchUsageError) {
      io.error(`${error.message}\n\n${usageText()}`)
      return 1
    }
    throw error
  }

  const result = options.exampleId
    ? resolveDiscoverResearchExampleResult(options.exampleId)
    : await resolveDiscoverResearchResult(options.parentName!)

  if (options.json) {
    io.log(JSON.stringify(result, null, 2))
  } else {
    io.log(renderDiscoverResearchResult(result))
  }

  return result.officialEndpointDeclared ? 0 : 2
}

function isMainInvocation(): boolean {
  const invokedPath = process.argv[1] ?? ''
  return (
    invokedPath === 'src/discover-research.ts'
    || invokedPath.endsWith('/src/discover-research.ts')
    || invokedPath.endsWith('\\src\\discover-research.ts')
  )
}

if (typeof process !== 'undefined' && isMainInvocation()) {
  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  runDiscoverResearchCli(args)
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error) => {
      console.error('ÆNS discover-research failed:', error)
      process.exit(1)
    })
}
