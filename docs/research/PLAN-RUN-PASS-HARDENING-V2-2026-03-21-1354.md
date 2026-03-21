# Plan — Run/Pass Hardening v2 (2026-03-21 13:54 UTC)

## Goal
Tighten run/pass completeness semantics to reduce overclaim risk while preserving compact wait-loop telemetry.

## Scope boundary
- Submission wait-loop docs only.
- No product/deploy code changes.
- Keep schema parseable and low-noise.

## Tasks (next 1–3)

### 1) Add pass-criteria reference token
Target: evidence-line schema in bundle index.

Acceptance criteria:
- Adds `pass_criteria_ref=<path|doc>` token.
- Ref maps to the exact criteria used to interpret `checks_pass=4/4`.
- Decision lines are invalid without this reference.

### 2) Add pass-quality marker
Target: evidence-line schema.

Acceptance criteria:
- Adds `pass_quality=clean|warn|degraded` token.
- Boundary rule specifies degraded quality touching blocker checks keeps `NO-SUBMIT`.
- Marker remains optional only if `checks_pass` is not complete.

### 3) Add refresh-window uniqueness + blocker precedence rule
Target: schema + closure wording.

Acceptance criteria:
- Require evidence anchor and marker timestamp linkage to current refresh window.
- Explicitly state external blocker precedence: missing required assets force `NO-SUBMIT` regardless of run/pass success tokens.
- Keep one-line canonical format readable.

## Done definition
Run/pass tokens become interpretable with criteria grounding, quality nuance, refresh-window linkage, and explicit blocker dominance, reducing overconfidence in unchanged loops.
