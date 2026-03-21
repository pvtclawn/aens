# Plan — Probe Validator Hardening v1 (2026-03-21 18:14 UTC)

## Goal
Harden the upcoming lightweight probe-window metadata validator so it stays trustworthy as governance docs evolve.

## Scope boundary
- Validator governance controls only.
- No new service/runtime behavior changes.
- Keep implementation minimal and CI-friendly.

## Tasks (next 1–3)

### 1) Add policy-version coupling
Target: validator input contract + checklist/procedure docs.

Acceptance criteria:
- Introduce a `policy_version` field in probe-window artifacts.
- Validator compares artifact `policy_version` to expected current version.
- Version mismatch fails validation with explicit remediation hint.

### 2) Add severity-tiered checks
Target: validator rule set.

Acceptance criteria:
- Classify rules as `critical` or `warning`.
- Missing provenance refs / ordering violations / identity reuse => `critical` (fail exit).
- Non-blocking formatting quality issues => `warning` (reported but non-fatal).
- Output includes severity-tagged findings.

### 3) Add CI trigger rule for governance-file changes
Target: repo workflow/docs policy.

Acceptance criteria:
- Validator is required in CI (or equivalent pre-merge gate) when these files change:
  - privileged probe checklist,
  - controlled probe procedure,
  - filled probe-window artifacts.
- Local command documented for fast pre-check.

## Done definition
Tiny governance validator remains lightweight but avoids shallow-compliance drift through version coupling, severity semantics, and enforced execution on relevant changes.
