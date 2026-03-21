# Seventy-First Slice Research — Provenance Ref Auto-Check (2026-03-21 17:54 UTC)

## Scope
Define a lightweight, machine-checkable validation approach for privileged-probe lifecycle provenance refs without overengineering.

## Problem
Current lifecycle docs are stronger, but validation is still mostly manual. We need a minimal automated check to flag missing/invalid provenance fields early.

## Proposed minimal approach
Use a small markdown linter script (single file) that validates required checklist keys and reference formatting.

### Inputs
- `docs/research/PRIVILEGED-PROBE-WINDOW-CHECKLIST.md`
- any filled probe-window artifact markdown file

### Required checks (v1)
1. Presence checks for critical refs:
   - `token_issue_evidence_ref`
   - `enable_deploy_evidence_ref`
   - `revoke_evidence_ref`
   - `disable_deploy_evidence_ref`
2. Timestamp format checks (ISO-8601 UTC):
   - `*_at` fields must match `YYYY-MM-DDTHH:MM:SSZ`
3. Ordering checks:
   - `window_started_at < window_expires_at <= token_expires_at`
   - `token_revoked_at <= window_closed_at`
4. Identity checks:
   - non-empty `window_id`
   - non-empty `token_fingerprint`

### Output contract
- Exit `0`: pass
- Exit `1`: one or more failed checks
- Compact report format:
  - `PASS <check-name>`
  - `FAIL <check-name>: <reason>`

## Why this is enough for now
- catches highest-risk metadata failures,
- low implementation cost,
- no dependency on external systems,
- easy to run in CI or local pre-commit.

## Next smallest build slice
Implement `scripts/validate-probe-window-metadata.ts` and add one npm/bun script alias (e.g., `bun run validate:probe-window <file>`).
