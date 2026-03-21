# Plan — reasonCode v2 Governance (2026-03-21 15:53 UTC)

## Goal
Freeze guardrails for future semantic-field expansions after successful reasonCode v1 rollout.

## Scope boundary
- Governance/test/verification planning only.
- No additional semantic fields in this slice.
- Preserve existing live contract behavior.

## Tasks (next 1–3)

### 1) Set taxonomy budget + version policy
Target: reason taxonomy governance note.

Acceptance criteria:
- Define max number of reason categories allowed in `v1` without version bump.
- Define explicit trigger for `reasonSchemaVersion` bump.
- Require changelog line for each taxonomy change.

### 2) Add old-field behavior golden tests
Target: service-response tests.

Acceptance criteria:
- Freeze baseline expectations for existing fields (`authorization.summary`, `officialEndpointDeclared`, etc.).
- Ensure semantic additions cannot silently alter old-field behavior.

### 3) Add compact live probe matrix rule
Target: rollout verification checklist.

Acceptance criteria:
- Require at least 3 differentiated probe inputs (e.g., likely-authorized, likely-unauthorized, likely-missing-child).
- Verify both old-field stability and new reason semantics across probes.
- Keep check output concise and repeatable.

## Done definition
Future semantic enrichments can proceed with bounded taxonomy growth, stable legacy behavior, and differentiated live verification, reducing drift and ambiguity risk.
