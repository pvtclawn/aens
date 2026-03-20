#!/usr/bin/env bun
import { classifyCapabilityAuthorization } from './capability-authorization'
import { CliUsageError, parseCliArgs, type CliOptions } from './cli-args'
import { getExampleScenario, listExampleIds } from './examples'
import { fetchLinkedRecords } from './linked-records'
import { renderProfileReport } from './report'
import { resolveAensProfile } from './resolver'

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
      console.error('ÆNS lookup failed:', error)
      process.exit(1)
    })
}
