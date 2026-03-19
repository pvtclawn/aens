#!/usr/bin/env bun
import { fetchLinkedRecords } from './linked-records'
import { renderProfileReport } from './report'
import { resolveAensProfile } from './resolver'

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const ensName = args.find((arg) => !arg.startsWith('--'))
  const withLinks = args.includes('--with-links')

  if (!ensName) {
    console.error('Usage: bun run src/cli.ts <ens-name> [--with-links]')
    process.exit(1)
  }

  const profile = await resolveAensProfile({ ensName })
  const linkedRecords = withLinks ? await fetchLinkedRecords(profile) : []
  console.log(renderProfileReport(profile, linkedRecords))

  if (!profile.address) {
    process.exitCode = 2
  }
}

main().catch((error) => {
  console.error('AENS lookup failed:', error)
  process.exit(1)
})
