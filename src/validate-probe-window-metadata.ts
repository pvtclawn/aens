import { readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

export type Severity = 'critical' | 'warning'

export interface Finding {
  severity: Severity
  status: 'PASS' | 'WARN' | 'FAIL'
  check: string
  message: string
}

export interface ValidationResult {
  findings: Finding[]
  criticalFailures: number
  warnings: number
}

export interface ValidateOptions {
  template?: boolean
  expectedPolicyVersion?: string
  historyDir?: string
  targetPath?: string
}

const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
const DEFAULT_POLICY_VERSION = 'probe-window-v1'

const REQUIRED_KEYS: readonly string[] = [
  'policy_version',
  'window_id',
  'window_owner',
  'window_started_at',
  'window_expires_at',
  'max_probe_calls',
  'token_issued_at',
  'token_expires_at',
  'token_fingerprint',
  'token_issue_evidence_ref',
  'canonical_time_source',
  'allowed_clock_skew_ms',
  'enable_deploy_evidence_ref',
  'token_revoked_at',
  'window_closed_at',
  'disable_deploy_evidence_ref',
  'revoke_evidence_ref',
] as const

function canonicalKey(raw: string): string {
  return raw
    .replace(/`/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/u, '')
    .replace(/\s+/gu, '_')
}

export function parseMetadataFields(markdown: string): Map<string, string> {
  const out = new Map<string, string>()
  const lines = markdown.split(/\r\n|\n|\r/u)
  for (const line of lines) {
    const trimmed = line.trimStart()
    if (!trimmed.startsWith('- ')) continue
    const body = trimmed.slice(2)
    const sep = body.lastIndexOf(':')
    if (sep === -1) continue
    const keyRaw = body.slice(0, sep)
    const valueRaw = body.slice(sep + 1)
    const key = canonicalKey(keyRaw)
    const value = valueRaw.trim()
    if (key) out.set(key, value)
  }
  return out
}

function addFinding(findings: Finding[], severity: Severity, pass: boolean, check: string, message: string) {
  if (pass) {
    findings.push({ severity, status: 'PASS', check, message })
  } else {
    findings.push({ severity, status: severity === 'warning' ? 'WARN' : 'FAIL', check, message })
  }
}

function parseIsoUtc(value: string): number | null {
  if (!ISO_UTC_RE.test(value)) return null
  const ms = Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

function listMarkdownFiles(dir: string): string[] {
  const out: string[] = []
  const stack = [resolve(dir)]
  while (stack.length > 0) {
    const current = stack.pop()!
    for (const name of readdirSync(current)) {
      const full = resolve(current, name)
      const st = statSync(full)
      if (st.isDirectory()) {
        stack.push(full)
      } else if (st.isFile() && full.endsWith('.md')) {
        out.push(full)
      }
    }
  }
  return out
}

export function validateProbeWindowMetadata(markdown: string, opts: ValidateOptions = {}): ValidationResult {
  const template = opts.template ?? false
  const expectedPolicyVersion = opts.expectedPolicyVersion ?? DEFAULT_POLICY_VERSION
  const fields = parseMetadataFields(markdown)
  const findings: Finding[] = []

  for (const key of REQUIRED_KEYS) {
    const hasKey = fields.has(key)
    addFinding(findings, 'critical', hasKey, `field:${key}`, hasKey ? 'present' : 'missing')
    if (!hasKey) continue
    if (!template) {
      const value = fields.get(key) ?? ''
      addFinding(findings, 'critical', value.length > 0, `value:${key}`, value.length > 0 ? 'non-empty' : 'empty')
    }
  }

  const policyVersion = fields.get('policy_version') ?? ''
  addFinding(
    findings,
    'critical',
    policyVersion === expectedPolicyVersion,
    'policy_version',
    policyVersion === expectedPolicyVersion
      ? `matches ${expectedPolicyVersion}`
      : `expected ${expectedPolicyVersion}, got ${policyVersion || '<empty>'}`,
  )

  if (!template) {
    const canonicalTimeSource = fields.get('canonical_time_source') ?? ''
    const sourceValid = ['provider-utc', 'deployment-utc', 'local-utc'].includes(canonicalTimeSource)
    addFinding(findings, 'critical', sourceValid, 'canonical_time_source', sourceValid ? 'valid' : 'invalid')

    const maxProbeCalls = Number.parseInt(fields.get('max_probe_calls') ?? '', 10)
    addFinding(
      findings,
      'critical',
      Number.isInteger(maxProbeCalls) && maxProbeCalls >= 1 && maxProbeCalls <= 3,
      'max_probe_calls',
      `value=${fields.get('max_probe_calls') ?? '<empty>'}`,
    )

    const skewMs = Number.parseInt(fields.get('allowed_clock_skew_ms') ?? '', 10)
    addFinding(findings, 'critical', Number.isInteger(skewMs) && skewMs >= 0, 'allowed_clock_skew_ms', `value=${fields.get('allowed_clock_skew_ms') ?? '<empty>'}`)
    addFinding(findings, 'warning', Number.isInteger(skewMs) && skewMs <= 5000, 'allowed_clock_skew_ms:recommended', `recommended <=5000, got ${fields.get('allowed_clock_skew_ms') ?? '<empty>'}`)

    const windowStarted = parseIsoUtc(fields.get('window_started_at') ?? '')
    const windowExpires = parseIsoUtc(fields.get('window_expires_at') ?? '')
    const tokenIssued = parseIsoUtc(fields.get('token_issued_at') ?? '')
    const tokenExpires = parseIsoUtc(fields.get('token_expires_at') ?? '')
    const tokenRevoked = parseIsoUtc(fields.get('token_revoked_at') ?? '')
    const windowClosed = parseIsoUtc(fields.get('window_closed_at') ?? '')

    addFinding(findings, 'critical', windowStarted !== null, 'timestamp:window_started_at', 'ISO-8601 UTC required')
    addFinding(findings, 'critical', windowExpires !== null, 'timestamp:window_expires_at', 'ISO-8601 UTC required')
    addFinding(findings, 'critical', tokenIssued !== null, 'timestamp:token_issued_at', 'ISO-8601 UTC required')
    addFinding(findings, 'critical', tokenExpires !== null, 'timestamp:token_expires_at', 'ISO-8601 UTC required')
    addFinding(findings, 'critical', tokenRevoked !== null, 'timestamp:token_revoked_at', 'ISO-8601 UTC required')
    addFinding(findings, 'critical', windowClosed !== null, 'timestamp:window_closed_at', 'ISO-8601 UTC required')

    if (windowStarted !== null && windowExpires !== null && tokenExpires !== null) {
      addFinding(findings, 'critical', windowStarted < windowExpires, 'ordering:start<window_expiry', `${windowStarted} < ${windowExpires}`)
      addFinding(findings, 'critical', windowExpires <= tokenExpires, 'ordering:window_expiry<=token_expiry', `${windowExpires} <= ${tokenExpires}`)
    }

    if (tokenIssued !== null && tokenExpires !== null) {
      const ttlMs = tokenExpires - tokenIssued
      addFinding(findings, 'critical', ttlMs > 0 && ttlMs <= 30 * 60 * 1000, 'ttl:hard-cap', `ttlMs=${ttlMs}`)
      addFinding(findings, 'warning', ttlMs > 0 && ttlMs <= 15 * 60 * 1000, 'ttl:recommended', `recommended<=15m, ttlMs=${ttlMs}`)
    }

    if (tokenRevoked !== null && windowClosed !== null) {
      addFinding(findings, 'critical', tokenRevoked <= windowClosed, 'ordering:revoked<=closed', `${tokenRevoked} <= ${windowClosed}`)
    }

    if (windowClosed !== null && tokenExpires !== null) {
      addFinding(findings, 'warning', windowClosed <= tokenExpires, 'ordering:closed<=token_expiry', `${windowClosed} <= ${tokenExpires}`)
    }

    const evidenceKeys = [
      'token_issue_evidence_ref',
      'enable_deploy_evidence_ref',
      'revoke_evidence_ref',
      'disable_deploy_evidence_ref',
    ] as const
    for (const key of evidenceKeys) {
      const v = fields.get(key) ?? ''
      addFinding(findings, 'critical', v.length > 0, `provenance:${key}`, v.length > 0 ? 'present' : 'missing')
    }

    const targetPath = opts.targetPath ? resolve(opts.targetPath) : null
    if (opts.historyDir) {
      const historyFiles = listMarkdownFiles(opts.historyDir)
      const currentWindowId = fields.get('window_id') ?? ''
      const currentTokenFp = fields.get('token_fingerprint') ?? ''
      let windowDup = false
      let tokenDup = false
      for (const file of historyFiles) {
        const resolvedFile = resolve(file)
        if (targetPath && resolvedFile === targetPath) continue
        const f = parseMetadataFields(readFileSync(file, 'utf8'))
        if (currentWindowId && f.get('window_id') === currentWindowId) windowDup = true
        if (currentTokenFp && f.get('token_fingerprint') === currentTokenFp) tokenDup = true
      }
      addFinding(findings, 'critical', !windowDup, 'uniqueness:window_id', windowDup ? 'duplicate window_id found' : 'unique')
      addFinding(findings, 'critical', !tokenDup, 'uniqueness:token_fingerprint', tokenDup ? 'duplicate token_fingerprint found' : 'unique')
    } else {
      addFinding(findings, 'warning', false, 'uniqueness:history', 'history-dir not provided; uniqueness checks skipped')
    }
  }

  const criticalFailures = findings.filter((f) => f.severity === 'critical' && f.status === 'FAIL').length
  const warnings = findings.filter((f) => f.status === 'WARN').length
  return { findings, criticalFailures, warnings }
}

function parseCli(argv: string[]): { file: string, options: ValidateOptions } {
  const options: ValidateOptions = {}
  let file = ''

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--template') {
      options.template = true
    } else if (arg === '--history-dir') {
      options.historyDir = argv[i + 1]
      i += 1
    } else if (arg === '--policy-version') {
      options.expectedPolicyVersion = argv[i + 1]
      i += 1
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`)
    } else {
      file = arg
    }
  }

  if (!file) {
    throw new Error('Usage: bun run src/validate-probe-window-metadata.ts [--template] [--history-dir <dir>] [--policy-version <v>] <file>')
  }

  options.targetPath = resolve(file)
  return { file, options }
}

if (import.meta.main) {
  try {
    const { file, options } = parseCli(process.argv.slice(2))
    const markdown = readFileSync(file, 'utf8')
    const result = validateProbeWindowMetadata(markdown, options)
    for (const finding of result.findings) {
      // eslint-disable-next-line no-console
      console.log(`${finding.status} [${finding.severity}] ${finding.check}: ${finding.message}`)
    }
    process.exit(result.criticalFailures > 0 ? 1 : 0)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
