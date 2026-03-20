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
