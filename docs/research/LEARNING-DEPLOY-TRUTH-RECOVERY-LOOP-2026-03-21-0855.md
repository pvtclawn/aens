# Learning Note — Deploy + Truth Recovery Loop (2026-03-21 08:55 UTC)

## Context
This cycle moved from repeated `404` observations to explicit root-cause isolation, minimal fix, and full submission-truth realignment.

## Applied learning (generalizable)

### 1) Separate **state diagnosis** from **state interpretation**
A recurring mistake is labeling every failure as "deploy lag." The stronger pattern is:
- first capture raw state (`status`, logs, headers, route behavior)
- then label the state (lag vs build failure vs config mismatch)

In this cycle, that separation exposed the real blocker quickly:
- not generic lag
- but Vercel app-only install context failing root import resolution (`viem` from repo-root `src/`)

### 2) Treat "fix shipped" and "truth updated" as two different completion gates
Shipping the technical fix (`bf6148e`, `8ab2d31`) was only gate one.
Gate two was proving all downstream truth surfaces caught up:
- live route status
- judge-facing docs wording
- wrapped artifact embedded status fields

Without gate two, stale artifacts/docs keep broadcasting old truth even after runtime recovery.

### 3) Keep one canonical machine truth surface and regenerate it after state changes
The wrapped artifacts under `docs/submission/artifacts/` became the machine-facing source of truth.
That creates a strict operational rule:
- any change in live deployment status must trigger artifact regeneration
- otherwise machine judges consume stale state with false confidence

### 4) Prefer tiny corrective slices over broad rewrites under incident pressure
The fastest reliable path was:
1. isolate root cause
2. ship smallest dependency/build-context fix
3. verify live recovery
4. patch exactly two stale docs
5. regenerate two canonical artifacts
6. verify end-to-end alignment

This minimized risk while preserving evidentiary continuity.

## Reusable micro-playbook for future loops
1. Verify repo health and live checks.
2. If mismatch persists, fetch deploy logs and classify failure mode explicitly.
3. Ship minimal fix with one bounded objective.
4. Re-verify live status.
5. Update human-facing docs that encode old assumptions.
6. Regenerate canonical machine artifacts.
7. Run one final alignment verification note.

## Main takeaway
For agent-native products, recovery is complete only when **runtime state, human docs, and machine artifacts all agree on the same truth**.
