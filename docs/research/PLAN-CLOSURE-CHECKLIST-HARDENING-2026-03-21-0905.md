# Plan — Closure Checklist Hardening (2026-03-21 09:05 UTC)

## Goal
Incorporate the red-team mitigations into a tiny, practical recovery-closure checklist without reopening broad architecture work.

## Scope boundary
- Keep this as process/docs hardening only.
- No product-surface redesign.
- No infrastructure migration work.

## Tasks (next 1–3)

### 1) Add a compact closure checklist section to recovery docs
Target: append a reusable checklist block to the latest recovery verification note template/path.

Acceptance criteria:
- Checklist includes exactly four gates:
  1. two consistent live samples,
  2. docs/artifacts synchronized,
  3. judged URL deployment identity recorded,
  4. authorization-vs-liveness wording boundary present.
- Wording is concise and execution-oriented.

### 2) Add one reproducible command pair for the "two-sample" gate
Target: define the exact command sequence used for sample-1 and sample-2 verification.

Acceptance criteria:
- Commands are copy-paste runnable from `aens/`.
- Output expectations are explicit (`discover research page ok`, `preferredSurfaceReady yes`, `bootstrapProofReady no`).

### 3) Freeze one anti-drift rule for artifact freshness
Target: document a minimal freshness rule tied to submission artifact regeneration.

Acceptance criteria:
- Rule states when artifact regeneration is mandatory.
- Rule states the failure condition (docs changed but artifacts stale).
- Rule avoids requiring heavy CI changes in this slice.

## Done definition for this plan
A single follow-up build slice can execute these checklist/doc additions directly, and a subsequent verify slice can confirm the checklist is now used in closure notes.
