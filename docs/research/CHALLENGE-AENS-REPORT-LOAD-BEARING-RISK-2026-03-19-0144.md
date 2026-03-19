# Challenge — AENS report load-bearing risk (2026-03-19 01:44 UTC)

## Purpose
Red-team whether the current AENS report flow is truly ENS-load-bearing or still too close to a decorated link aggregator.

## Verdict
The current slices prove meaningful progress, but the report flow still has five major weaknesses:
1. mixed evidence is flattened into one report
2. `Discovery surface present: yes` is too generous
3. receipt-aware interpretation is still cheaply fakeable
4. capability authorization is still mostly absent
5. live observation and durable identity are still easy to confuse

## Core risk
AENS can currently over-compress different trust classes:
- ENS-anchored facts
- linked-document claims
- live observations
- structural inferences

If presented too uniformly, that weakens trust rather than strengthening it.

## What this means for the thesis
ENS is already the entrypoint, but not yet the full authority structure.
To become truly load-bearing, AENS needs to move from:
- ENS profile + linked records

toward:
- ENS-anchored identity + parent-authorized capability surfaces + clearly tiered trust semantics.

## Best next fixes
1. Add a trust-tiered report model with provenance labels.
2. Split discovery into sharper states (identity / callable / proof / capability-authorized).
3. Add explicit parent-authorized capability surfaces.
4. Keep receipt-shape parsing, but reserve stronger language for corroborated proofs only.

## Bottom line
Current AENS is stronger as an ENS-native **trust debugger** than as an ENS-native **capability authority**.
That is a good sign, but also the clearest next gap to close.
