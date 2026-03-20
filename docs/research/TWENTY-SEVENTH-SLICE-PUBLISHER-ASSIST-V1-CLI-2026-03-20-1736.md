# Twenty-seventh ÆNS slice — minimal publisher-assist v1 CLI (2026-03-20 17:36 UTC)

## Purpose
Execute the first build step from:
- `docs/research/PLAN-MINIMAL-PUBLISHER-ASSIST-STATE-MACHINE-V1-2026-03-20-1731.md`

Build the smallest read-only publisher-assist CLI slice that:
1. derives one current publish state from fresh evidence
2. prints one next legal step
3. includes explicit human-review checks before write-oriented steps
4. prints follow-up verification commands

## Files changed
- `src/publish-assist.ts` (new)
- `src/publish-assist.test.ts` (new)
- `package.json` (new script)
- `src/index.ts` (export wiring)

## What shipped
### 1) New read-only publisher-assist CLI module
`src/publish-assist.ts` now provides:
- state model (`preflight-ready`, `root-needs-write`, `root-verified`, `child-needs-create-or-write`, `child-verified-provisional`, `needs-parent-authorization`, `parent-authorized-verified`, `proof-captured`, `needs-operator-reconcile`, `aborted`)
- snapshot resolution from fresh evidence:
  - root/child ENS reads
  - public proof state (`check-public-surface` equivalent fetch path)
  - capability authorization classification
  - optional proof artifact discovery in proof dir
- deterministic state derivation logic
- render function that prints:
  - current state
  - summary
  - next legal step only
  - `human review required` checks before write-oriented steps
  - post-step verification commands

It performs **no writes** and **no wallet automation**.

### 2) New CLI entrypoint behavior
New script:
- `bun run publish-assist`

Supported args:
- `--root-name <ens-name>`
- `--child-name <ens-name>`
- `--proof-dir <dir>`

Defaults:
- root: `pvtclawn.eth`
- child: `research.pvtclawn.eth`

### 3) New tests
`src/publish-assist.test.ts` covers:
- arg parsing defaults/overrides
- `preflight-ready` state
- reconcile behavior when preferred surface is not ready
- `needs-parent-authorization` path when child is verified but unlisted
- `parent-authorized-verified` vs `proof-captured` distinction

## Verification
At slice time:
- `bunx tsc --noEmit` passes
- `bun test src/*.test.ts` passes (`50 pass`, includes new suite)
- `bun run publish-assist` runs successfully and outputs:
  - `Current publish state: preflight-ready`
  - one next legal step
  - explicit human review checks
  - follow-up verification commands

## Acceptance mapping
Planned acceptance target | Result
- derive one current state from fresh evidence | ✅
- print one next legal step | ✅
- include human review checkpoint before write-oriented steps | ✅
- print follow-up verification commands | ✅
- no writes / no wallet automation | ✅

## Core delta
None.
No change to parent/child authorization model.

## Rail delta
Moderate.
This is adjacent post-proof UX tooling.

## Counterfactual relevance test
Would this slice still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting product/UX tooling work, not protocol-center progress.

## Result
A minimal read-only publisher-assist CLI now exists and is test-backed.
It provides a concrete, evidence-derived “next legal step” flow without pretending to automate wallet custody.
