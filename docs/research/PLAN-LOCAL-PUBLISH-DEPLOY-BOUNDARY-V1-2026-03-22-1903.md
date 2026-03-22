# Plan — Local Publish / Deploy Boundary v1 (2026-03-22 19:03 UTC)

## Context
ÆNS currently has meaningful local-only work on `main...origin/main [ahead 3]`, including the app-route/layout fix and the accompanying boundary notes. The immediate goal is not new feature scope; it is to move the current slice from **local commit truth** to **remote truth** and then to **verified public/deploy truth** without letting status wording or wallet-flow guidance outrun evidence.

## Goal
Define the smallest safe sequence that converts the current local-only ÆNS state into remote/deployed truth while preserving honest external claims.

## Task 1 — Freeze publication target and remote-proof gate
Establish the exact publication target and what counts as proof that origin now contains it.

### Acceptance criteria
- The target publication commit/range is explicit (current head or an amended head if any fixups are needed first).
- `git status -sb` no longer reports `ahead` **or** equivalent remote visibility is independently verified.
- A status note can truthfully say `pushed remotely` without implying `deployed/live`.

### Out of scope
- No new product features.
- No deploy claim yet.

---

## Task 2 — Verify deploy truth against the intended public surface
Once remote publication exists, prove what the public actually serves.

### Acceptance criteria
- The intended public routes are checked live, at minimum:
  - `/`
  - `/research/`
  - `/research-capability` redirect behavior
  - `/write-records/`
- The live surface reflects the canonical route shift away from `/research-capability/` as the public primary route.
- Public verification is based on an outside-observable proof source (live URL check, deployment receipt/history, or equivalent), not on local build success alone.
- Any remaining mismatch is reported as a deploy/public blocker rather than as a code blocker.

### Out of scope
- No ENS wallet write yet.
- No marketing-style claim upgrades before live proof exists.

---

## Task 3 — Re-open external execution only after deploy truth is verified
Only after the public surface is verified should external guidance advance.

### Acceptance criteria
- If deploy truth is confirmed, the next user-facing recommendation can safely move to the ENS write step for `theaens.eth` / `research.theaens.eth`.
- If deploy truth is not confirmed, user-facing guidance stays in one of these forms only:
  - `implemented locally`
  - `pushed remotely`
  - `not yet deployed / not yet publicly verified`
- Wallet/signature instructions are explicitly blocked on verified deploy truth unless Egor asks for a local/manual path.

### Out of scope
- No irreversible wallet action during planning.
- No assumption that deploy follows push automatically.

## Smallest next handoff
Lane B should implement **Task 1 only** if and when publication is requested/allowed: convert the current local-only slice into remote truth, then stop and report the new state without collapsing it into `live`.
