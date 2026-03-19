#!/usr/bin/env bun
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCommandSection, buildProofCaptureHeader, resolveProofCaptureConfig } from './proof-capture'

function repoRootFromModule(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..')
}

function timestampNow(): string {
  return new Date().toISOString().replace(/:/g, '-').replace(/\.\d{3}Z$/, 'Z')
}

function readRepoCommit(repoRoot: string): string {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(detail.length > 0 ? `Unable to read git commit: ${detail}` : 'Unable to read git commit.')
  }

  return result.stdout.trim()
}

function runCapturedCommand(repoRoot: string, title: string, command: string[]): {
  section: string
  exitCode: number
} {
  const result = spawnSync(command[0]!, command.slice(1), {
    cwd: repoRoot,
    encoding: 'utf8',
  })

  const outputParts = [result.stdout, result.stderr].filter((value) => value && value.length > 0)
  const output = outputParts.length > 0 ? outputParts.join('\n').trimEnd() : '(no output)'
  const exitCode = result.status ?? 1

  if (result.error) {
    return {
      section: buildCommandSection({
        title,
        exitCode,
        output: `${output}\n${result.error.message}`.trim(),
      }),
      exitCode,
    }
  }

  return {
    section: buildCommandSection({
      title,
      exitCode,
      output,
    }),
    exitCode,
  }
}

export async function runCaptureProof(
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
  io: { log(message: string): void; error(message: string): void } = {
    log: (message) => console.log(message),
    error: (message) => console.error(message),
  },
): Promise<number> {
  const label = args[0] ?? 'capture'
  const repoRoot = repoRootFromModule()
  const repoCommit = readRepoCommit(repoRoot)
  const config = resolveProofCaptureConfig({
    label,
    timestamp: timestampNow(),
    repoRoot,
    repoCommit,
    outDir: env.AENS_PROOF_DIR,
    publicationMode: env.AENS_PROOF_PUBLICATION_MODE,
    serviceUrl: env.AENS_PROOF_SERVICE_URL,
  })

  mkdirSync(config.outDir, { recursive: true })
  writeFileSync(config.outFile, buildProofCaptureHeader(config))

  let overallExitCode = 0
  for (const [title, command] of [
    ['bun run inspect pvtclawn.eth', ['bun', 'run', 'inspect', 'pvtclawn.eth']],
    ['bun run inspect research.pvtclawn.eth', ['bun', 'run', 'inspect', 'research.pvtclawn.eth']],
  ] as const) {
    const result = runCapturedCommand(repoRoot, title, [...command])
    appendFileSync(config.outFile, result.section)
    if (overallExitCode === 0 && result.exitCode !== 0) {
      overallExitCode = result.exitCode
    }
  }

  io.log(config.outFile)
  return overallExitCode
}

function isMainInvocation(): boolean {
  const invokedPath = process.argv[1] ?? ''
  return (
    invokedPath === 'src/capture-proof.ts'
    || invokedPath.endsWith('/src/capture-proof.ts')
    || invokedPath.endsWith('\\src\\capture-proof.ts')
  )
}

if (isMainInvocation()) {
  runCaptureProof(process.argv.slice(2))
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error) => {
      console.error('ÆNS proof capture failed:', error)
      process.exit(1)
    })
}
