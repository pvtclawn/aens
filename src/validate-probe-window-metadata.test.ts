import { describe, expect, test } from 'bun:test'
import { validateProbeWindowMetadata } from './validate-probe-window-metadata'

const TEMPLATE_MD = `
- policy_version: probe-window-v1
- window_id:
- window_owner:
- window_started_at:
- window_expires_at:
- max_probe_calls:
- token_issued_at:
- token_expires_at:
- token_fingerprint:
- token_issue_evidence_ref:
- canonical_time_source:
- allowed_clock_skew_ms:
- enable_deploy_evidence_ref:
- token_revoked_at:
- window_closed_at:
- disable_deploy_evidence_ref:
- revoke_evidence_ref:
`

const VALID_FILLED_MD = `
- policy_version: probe-window-v1
- window_id: window-2026-03-21-1
- window_owner: clawn
- window_started_at: 2026-03-21T16:00:00Z
- window_expires_at: 2026-03-21T16:10:00Z
- max_probe_calls: 1
- token_issued_at: 2026-03-21T16:00:00Z
- token_expires_at: 2026-03-21T16:15:00Z
- token_fingerprint: tok_abc123
- token_issue_evidence_ref: logs/issue-1.md
- canonical_time_source: provider-utc
- allowed_clock_skew_ms: 5000
- enable_deploy_evidence_ref: logs/enable-1.md
- token_revoked_at: 2026-03-21T16:06:00Z
- window_closed_at: 2026-03-21T16:07:00Z
- disable_deploy_evidence_ref: logs/disable-1.md
- revoke_evidence_ref: logs/revoke-1.md
`

describe('validateProbeWindowMetadata', () => {
  test('template mode passes when required keys exist and policy version matches', () => {
    const result = validateProbeWindowMetadata(TEMPLATE_MD, { template: true })
    expect(result.criticalFailures).toBe(0)
  })

  test('fails when policy version mismatches', () => {
    const bad = TEMPLATE_MD.replace('probe-window-v1', 'probe-window-v0')
    const result = validateProbeWindowMetadata(bad, { template: true })
    expect(result.criticalFailures).toBeGreaterThan(0)
  })

  test('filled metadata passes core critical checks', () => {
    const result = validateProbeWindowMetadata(VALID_FILLED_MD)
    expect(result.criticalFailures).toBe(0)
  })

  test('fails ordering check when window expires after token expiry', () => {
    const bad = VALID_FILLED_MD.replace('token_expires_at: 2026-03-21T16:15:00Z', 'token_expires_at: 2026-03-21T16:05:00Z')
    const result = validateProbeWindowMetadata(bad)
    expect(result.criticalFailures).toBeGreaterThan(0)
  })
})
