# Twenty-third ÆNS slice — proof-scope wording hardening (2026-03-19 20:45 UTC)

## Purpose
Make the first live ÆNS proof story harder to misread.

The recent trust/publication work made the system model much sharper:
- preferred surface readiness is separate from bootstrap proof readiness
- proof artifacts now encode publication mode and public-truth snapshots
- deployment dashboards are treated as part of the service-trust surface

But there was still a narrative gap:
- the first live proof could still sound more machine-closed than it really is

This slice hardens the human-facing proof wording so the live proof must explicitly separate:
1. machine-verifiable identity/capability claims
2. observed public-alias state
3. unresolved human control-plane state

## Changes made

### 1) Added a canonical proof-scope template
Added:
- `docs/research/FIRST-LIVE-AENS-PROOF-SCOPE-TEMPLATE-2026-03-19-2045.md`

This freezes the required top-level structure for the first live proof note:
1. `Machine-verifiable scope`
2. `Observed public-alias state (time-scoped)`
3. `Unresolved human control-plane state`
4. `Not yet proven`

It also includes exact bootstrap-mode wording guidance, preferred phrases, avoid-phrases, and one compact canonical summary for the current case.

### 2) Hardened the operator steps
Updated:
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

Key changes:
- the operator flow now starts by running `bun run check-public-surface` before choosing publication mode
- the operator is told to keep the proof-scope template open during the session
- the final proof-note structure is now mandatory and explicitly layered
- the bootstrap-mode case is described narrowly instead of leaving room for “basically fixed” proof language

### 3) Hardened the live-session checklist
Updated:
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`

Key changes:
- baseline capture now explicitly includes `bun run check-public-surface`
- saved proof now explicitly includes the final `capture-proof` artifact with public-truth snapshot
- the old flat scope-language checklist is replaced with a layered `Proof-scope wording checklist`
- that checklist now requires separate statements for:
  - machine-verifiable scope
  - observed public-alias state (time-scoped)
  - unresolved human control-plane state
  - not-yet-proven boundaries

## Verification
Ran:
```bash
bun test
bunx tsc --noEmit
```

Observed:
- tests: pass
- typecheck: pass
- repo health remains clean after the wording/doc changes

## Current bootstrap-mode wording consequence
The proof story for the current state is now much harder to flatten incorrectly.

The docs now force the first live proof to say, in effect:
- **machine-verifiable**: ENS authority path / publication artifact facts
- **observed now**: preferred route not publicly ready, bootstrap fallback reachable at capture time
- **still unresolved**: human-controlled deployment control plane for the preferred route
- **not yet proven**: invocation, payment flow, runtime auth, or end-to-end machine closure

## Verdict
This slice closes the remaining narrative gap without reopening any deployment speculation.

The first live proof can still be bootstrap-mode narrow.
But it is now much harder for the surrounding docs/checklists to accidentally narrate that narrow proof as if it were full machine-closed service readiness.

## Next step
Use Lane C to verify that the updated operator/checklist/template surfaces stay aligned with the current live truth and do not reintroduce overclaiming language anywhere.
