# Plan — Validator Issue Prioritization + Provenance Gating + Three-Gate Status v1 (2026-03-21 23:48 UTC)

## Goal
Freeze a compact implementation plan that turns validator UX challenge findings into enforceable behavior without weakening fail-closed guarantees.

Focus areas:
1. deterministic issue prioritization output,
2. strict/compat provenance gating,
3. explicit three-gate completion status contract.

## Smallest shippable milestone
Ship one thin validator vertical that improves operator usability while preserving trust boundaries:
- structured, prioritized `ValidationIssue[]` output,
- explicit validation mode provenance in artifacts,
- status contract that prevents `manifest-valid` from being mistaken as `poststate-converged`.

## Tasks (1–3) with acceptance criteria

### Task 1 — Deterministic issue prioritization output
Implement issue model + stable sort policy for validator feedback.

Proposed issue shape:
- `reasonCode`
- `path`
- `severity`
- `hint`
- `phase` (`structure` | `payload` | `envelope` | `canonicalization` | `hash`)

Output behavior:
- top-N primary issues by default,
- deterministic ordering by phase/severity/path,
- `remainingIssueCount` when truncated,
- full tree only under `--verbose`.

**Acceptance criteria**
- same invalid manifest always produces identical issue order,
- hash-phase issues never appear before payload/envelope structural failures,
- default output remains concise while preserving machine-readable issue detail,
- tests lock ordering and truncation behavior.

---

### Task 2 — Strict/compat provenance gating
Enforce mode semantics so relaxed local checks cannot masquerade as release-grade validation.

Required behavior:
- validator emits `validationMode` in result metadata,
- CI/release paths require `validationMode=strict`,
- compat-mode artifacts are explicitly non-release and flagged.

**Acceptance criteria**
- CI command path fails on compat-mode artifact usage,
- strict-mode path rejects unsupported/unknown payload keys as configured,
- compat-mode output includes explicit warning banner and cannot set release-ready status,
- tests cover strict pass/fail and compat warning paths.

---

### Task 3 — Three-gate completion status contract
Define and enforce distinct completion states:
1. `manifest-valid`
2. `execution-verified`
3. `poststate-converged`

Rules:
- validator alone can only produce `manifest-valid`,
- `execution-verified` requires per-record tx evidence,
- `poststate-converged` requires semantic post-write chain checks,
- any failed/unverified record blocks convergence.

**Acceptance criteria**
- status vocabulary is centralized and referenced by publish/runbook docs,
- reporting layer cannot emit `poststate-converged` from validator-only context,
- template/report tests fail if state transitions skip required gates.

## Out of scope (v1)
- wallet signing automation
- write execution orchestrator
- discover API schema changes

## Next lane handoff
Lane B: implement Task 1 only (issue model + deterministic prioritization/truncation output + tests), leaving provenance gating and three-gate state enforcement for follow-up slices.
