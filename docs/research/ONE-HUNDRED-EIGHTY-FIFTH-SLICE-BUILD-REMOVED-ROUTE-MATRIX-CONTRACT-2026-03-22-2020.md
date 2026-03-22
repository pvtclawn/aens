# One-Hundred-Eighty-Fifth Slice Build — Removed-Route Matrix Contract (2026-03-22 20:20 UTC)

## Context
The two-surface reset for ÆNS is now publicly true on the canonical alias, but the **proof contract** for removed routes was still mostly narrative. The missing thin slice was not another deploy change; it was a deterministic contract for how removed-route outcomes get classified.

The planned v1 scope was intentionally narrow:
- freeze the removed-route matrix in code
- freeze outcome-class logic in code/tests
- avoid broad checker rewrites or new public claims machinery in the same slice

## What shipped
Added a dedicated removed-route contract module:
- `src/removed-surface.ts`
- `src/removed-surface.test.ts`
- exported via `src/index.ts`

### Frozen removed-route matrix
The contract now explicitly tracks these removed routes against the canonical alias:
- `/research`
- `/research/`
- `/research-capability`
- `/discover-research`

Each target also carries the only approved kept-surface redirect destinations:
- `/`
- `/write-records/`

### Frozen outcome classes
The v1 outcome classifier now deterministically returns exactly one of:
- `gone`
- `redirected-to-kept-surface`
- `blocked`
- `still-live-legacy-surface`

### Frozen classification rules
- `404` / `410` -> `gone`
- other `4xx` -> `blocked`
- final URL landing on `/` or `/write-records/` -> `redirected-to-kept-surface`
- final URL landing on any removed route -> `still-live-legacy-surface`
- unexpected live/broken destinations outside the approved kept surfaces -> `still-live-legacy-surface`

Most important hardening rule now encoded in tests:
> redirecting from one removed route to another removed route is **not success**.

## Why this matters
This turns the tombstone-proof conversation from “be careful with wording” into an actual typed contract. The checker/report layer can now depend on a deterministic removed-route matrix instead of hand-wavy interpretation.

## What this slice intentionally did *not* do
- no broad `check-public-surface` rewrite
- no status-doc rewrites
- no deploy behavior changes
- no submission-pack changes

That keeps the slice faithful to Task 1 only: freeze the contract first.

## Validation target for next lane
The next smallest useful follow-up is to use this contract in a compact tombstone-proof checker/report so heartbeat and submission status can consume:
- per-route outcome class
- short reason
- overall `safeToClaimLegacyRemoval`
