# One-Hundred-Fifty-First Slice Verification — Primary-Lock Integrity Guards Rollout (2026-03-22 09:57 UTC)

## Goal
Verify rollout of `5a5b9a2` against Task 1 boundaries from `PLAN-IMMUTABLE-PRIMARY-LOCK-INTEGRITY-GLOSSARY-PARITY-V1-2026-03-22-0946.md`:
1) alias token rejection,
2) `none => unlocked` tuple enforcement,
3) deterministic lock/source/reason derivation,
4) discover/public-surface regression check.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- targeted suite pass (`16 pass`)
- app build pass
- `bun run check-public-surface` **fails** (marker mismatch on root + research page)

## Verification evidence

### A) Alias token rejection boundary (PASS)
Runtime probe:
- `validatePrimaryLockState({ primarySource: 'ownership', primaryLocked: true, primarySelectionReason: 'ownership-mismatch' })`

Observed result:
- `ok=false`
- `reasonCode=primary-lock-integrity-violation`
- issue path includes `$.primarySource`

Result: non-canonical source aliases are deterministically rejected.

---

### B) `none => unlocked` tuple boundary (PASS)
Runtime probe:
- `validatePrimaryLockState({ primarySource: 'none', primaryLocked: true, primarySelectionReason: 'no-failure' })`

Observed result:
- `ok=false`
- `reasonCode=primary-lock-integrity-violation`
- issue message: `primarySource=none requires primaryLocked=false`

Result: tuple invariant is enforced fail-closed.

---

### C) Deterministic lock/source/reason derivation boundary (PASS)
Runtime probe over stage-gate payloads:
- mismatch payload -> `primarySource=ownership-contract`, `primaryLocked=true`, `primarySelectionReason=ownership-mismatch`
- resolved payload -> `primarySource=stage-gate`, `primaryLocked=true`, `primarySelectionReason=earliest-failing-stage`

Compact summary outputs include deterministic lock trio tokens in both cases.

Result: derivation is stable and mode-appropriate across resolved vs ownership-failure paths.

---

### D) Regression boundary — discover/public surface (FAIL: marker contract drift)
`bun run check-public-surface` output:
- public root: reachable but missing expected marker
- research capability page: reachable but missing expected marker
- discover research page: ok
- preferred surface ready: no

Root cause:
- public-surface marker expectations still reference old strings (`ÆNS — PrivateClawn landing`, `PrivateClawn Research Capability`) while app titles/labels were recently de-hardcoded/rebranded.

Result: this is a **checker-marker contract drift**, not a route reachability outage.

## Verdict
**PARTIAL PASS** — lock integrity guard rollout boundaries are verified for Task 1 logic, but public-surface verification currently fails due stale expected-marker strings in `src/public-surface.ts`.

## Next smallest handoff
Proceed to Lane D to freeze marker-contract update boundary:
- align expected markers with current app copy,
- preserve deterministic surface checks without reintroducing identity-specific text coupling,
- keep discover/public-surface checks green under current UI semantics.