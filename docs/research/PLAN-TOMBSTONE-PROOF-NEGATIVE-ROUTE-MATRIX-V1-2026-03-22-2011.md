# Plan — Tombstone-Proof Negative-Route Matrix v1 (2026-03-22 20:11 UTC)

## Context
ÆNS is locally simplified to two intended product surfaces:
- **ENS Root Explorer**
- **Write Records**

But live verification still shows legacy routes publicly reachable:
- `/research` -> `200` `Research endpoint — ÆNS`
- `/research/` -> `200` `Research endpoint — ÆNS`
- `/research-capability` -> `200`, resolves to `/research`
- `/discover-research` -> `200` `Discover the official research capability for an ENS identity — ÆNS`

Current proof is asymmetric:
- survivor proof exists (`/`, `/write-records/`)
- tombstone proof does **not** exist yet

So the smallest useful next plan is to make route-removal claims mechanically harder to overstate.

## Goal
Add a **negative-route / tombstone proof** path so the two-surface reset can only be described as publicly complete when removed routes have been checked explicitly.

## Task 1 — Define the removed-route matrix contract
Create one shared contract for the routes that must no longer behave like live product surfaces:
- `/research`
- `/research/`
- `/research-capability`
- `/discover-research`

For each route, record:
- requested URL
- HTTP status
- final URL after redirect
- title / marker summary
- outcome class

Required outcome classes:
- `gone`
- `redirected-to-kept-surface`
- `blocked`
- `still-live-legacy-surface`

### Acceptance criteria
- The route list is explicit and versioned in code/docs.
- Outcome classes are mutually exclusive and easy to audit.
- Redirecting from one removed route to another removed route is classified as `still-live-legacy-surface`, not success.
- The contract makes it impossible to confuse alias cleanup with actual retirement.

## Task 2 — Add a tombstone-proof checker/report
Implement a dedicated checker (or an extension next to `check-public-surface`) that evaluates the removed-route matrix and emits a compact summary per route plus an overall claim-safe verdict.

Minimum output per route:
- route label
- status/final URL
- outcome class
- short reason

Overall result should answer:
- `tombstoneProofReady: yes|no`
- `safeToClaimLegacyRemoval: yes|no`

### Acceptance criteria
- The checker fails closed if a removed route still returns a coherent legacy product page.
- The checker treats redirects to kept surfaces as acceptable, but redirects to removed surfaces as failure.
- Output stays short enough for heartbeat/submission usage while preserving machine-usable detail.
- Existing survivor checks for `/` and `/write-records/` remain unchanged in meaning.

## Task 3 — Wire the claim gate into status/submission wording
Update the current truth-control docs so route-removal language is gated by the tombstone matrix rather than by repo intent.

Target surfaces:
- `SYNTHESIS.md`
- submission bundle/index language
- any docs/checklists that currently risk implying “legacy routes are gone”

### Acceptance criteria
- Safe wording before matrix passes: `implemented locally`, `kept surfaces live`, `legacy routes still publicly reachable`.
- Unsafe wording remains blocked until tombstone proof passes: `legacy routes are gone`, `public deployment only exposes two surfaces`, `research/discovery routes retired publicly`.
- Submission prep can proceed without lying even when deploy cleanup is still pending.

## Smallest next task
**Lane B:** implement **Task 1 only** — freeze the removed-route matrix contract and outcome-class logic in code/tests or a narrowly-scoped checker module, without yet rewriting broad docs or deploy behavior.

## Why this is the right next slice
It is the thinnest change that converts “we should be careful” into an enforceable proof boundary. Once the matrix exists, future deploy checks and submission wording can depend on a concrete contract instead of memory and vibes.
