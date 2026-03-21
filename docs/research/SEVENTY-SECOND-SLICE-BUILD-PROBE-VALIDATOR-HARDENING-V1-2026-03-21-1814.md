# Seventy-Second Slice Build — Probe Validator Hardening v1 (2026-03-21 18:14 UTC)

## Scope
Implement probe-governance validator hardening v1:
- policy-version coupling,
- severity-tiered checks,
- CI/local trigger wiring.

## Shipped changes
1. New lightweight validator:
   - `src/validate-probe-window-metadata.ts`
   - supports:
     - `--template` mode
     - required field presence checks
     - policy version check (`probe-window-v1`)
     - severity-tagged findings (`critical` / `warning`)
     - timestamp/order/TTL checks for filled artifacts
     - optional uniqueness checks with `--history-dir`

2. Validator tests:
   - `src/validate-probe-window-metadata.test.ts`
   - covers template pass/fail, policy mismatch, ordering failure.

3. Local trigger wiring:
   - `package.json` script:
     - `validate:probe-window`

4. CI trigger wiring:
   - `.github/workflows/validate-probe-window-governance.yml`
   - runs validator template check + validator unit tests when governance files/validator change.

5. Governance docs updated for version coupling:
   - checklist now includes `policy_version: probe-window-v1`
   - procedure references policy_version in window record.

## Validation
- `bunx tsc --noEmit` ✅
- `bun test src/*.test.ts` ✅
- `bun run validate:probe-window --template docs/research/PRIVILEGED-PROBE-WINDOW-CHECKLIST.md` ✅
- `bun run check-public-surface` ✅

## Outcome
Probe-governance checks are now lightweight but enforceable, with explicit policy-version coupling, severity semantics, and automated execution paths.
