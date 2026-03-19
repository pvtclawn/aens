#!/usr/bin/env bun
import { classifyCapabilityAuthorization } from './capability-authorization'
import { getExampleScenario, listExampleIds } from './examples'
import { fetchLinkedRecords } from './linked-records'
import { renderProfileReport } from './report'
import { resolveAensProfile } from './resolver'

export interface CliOptions {
  ensName: string | null
  withLinks: boolean
  exampleId: string | null
}

export class CliUsageError extends Error {}

export function parseCliArgs(args: string[]): CliOptions {
  let ensName: string | null = null
  let withLinks = false
  let exampleId: string | null = null

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--with-links') {
      withLinks = true
      continue
    }

    if (arg === '--example') {
      const next = args[index + 1]
      if (!next || next.startsWith('--')) {
        throw new CliUsageError('Missing example id after --example')
      }
      exampleId = next
      index += 1
      continue
    }

    if (arg.startsWith('--example=')) {
      exampleId = arg.slice('--example='.length)
      if (!exampleId) {
        throw new CliUsageError('Missing example id after --example=')
      }
      continue
    }

    if (arg.startsWith('--')) {
      throw new CliUsageError(`Unknown flag: ${arg}`)
    }

    if (ensName) {
      throw new CliUsageError('Only one ENS name may be provided')
    }
    ensName = arg
  }

  if (exampleId && ensName) {
    throw new CliUsageError('Choose either an ENS name or --example, not both')
  }

  if (!exampleId && !ensName) {
    throw new CliUsageError('Provide an ENS name or --example <id>')
  }

  return {
    ensName,
    withLinks,
    exampleId,
  }
}

function usageText(): string {
  return [
    'Usage: bun run src/cli.ts <ens-name> [--with-links]',
    '   or: bun run src/cli.ts --example <example-id> [--with-links]',
    '',
    `Available examples: ${listExampleIds().join(', ')}`,
  ].join('\n')
}

export async function runCli(
  args: string[],
  io: { log(message: string): void; error(message: string): void } = {
    log: (message) => console.log(message),
    error: (message) => console.error(message),
  },
): Promise<number> {
  let options: CliOptions
  try {
    options = parseCliArgs(args)
  } catch (error) {
    if (error instanceof CliUsageError) {
      io.error(`${error.message}\n\n${usageText()}`)
      return 1
    }
    throw error
  }

  if (options.exampleId) {
    const example = getExampleScenario(options.exampleId)
    if (!example) {
      io.error(`Unknown example: ${options.exampleId}\n\n${usageText()}`)
      return 1
    }

    const linkedRecords = options.withLinks ? example.linkedRecords : []
    io.log(renderProfileReport(example.profile, linkedRecords, example.capabilityAuthorization))
    return example.profile.address ? 0 : 2
  }

  const profile = await resolveAensProfile({ ensName: options.ensName! })
  const parentProfile = profile.records.parentName
    ? await resolveAensProfile({ ensName: profile.records.parentName }).catch(() => null)
    : null
  const capabilityAuthorization = classifyCapabilityAuthorization({
    profile,
    parentProfile,
  })
  const linkedRecords = options.withLinks ? await fetchLinkedRecords(profile) : []

  io.log(renderProfileReport(profile, linkedRecords, capabilityAuthorization))
  return profile.address ? 0 : 2
}

function isMainInvocation(): boolean {
  const invokedPath = process.argv[1] ?? ''
  return (
    invokedPath === 'src/cli.ts'
    || invokedPath.endsWith('/src/cli.ts')
    || invokedPath.endsWith('\\src\\cli.ts')
  )
}

if (isMainInvocation()) {
  runCli(process.argv.slice(2))
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error) => {
      console.error('AENS lookup failed:', error)
      process.exit(1)
    })
}
