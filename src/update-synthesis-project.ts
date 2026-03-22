import { readFile } from 'node:fs/promises'

interface UpdateProjectArgs {
  projectUuid: string
  payloadPath: string
  apiKey: string
}

function parseArgs(argv: string[]): UpdateProjectArgs {
  let projectUuid = ''
  let payloadPath = ''

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    const next = argv[index + 1]

    if (token === '--project' && next) {
      projectUuid = next
      index += 1
      continue
    }

    if (token === '--payload' && next) {
      payloadPath = next
      index += 1
      continue
    }
  }

  const apiKey = process.env.SYNTHESIS_API_KEY ?? ''

  if (!projectUuid || !payloadPath || !apiKey) {
    throw new Error(
      'Usage: SYNTHESIS_API_KEY=... bun run update-synthesis-project -- --project <uuid> --payload <json-file>',
    )
  }

  return {
    projectUuid,
    payloadPath,
    apiKey,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const payloadText = await readFile(args.payloadPath, 'utf8')
  const payload = JSON.parse(payloadText)

  const response = await fetch(`https://synthesis.devfolio.co/projects/${args.projectUuid}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`Synthesis update failed (${response.status}): ${responseText}`)
  }

  console.log(responseText)
}

await main()
