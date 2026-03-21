# Challenge — Non-Breaking Semantic Rollout Pattern (2026-03-21 15:48 UTC)

## Target challenged
`docs/research/LEARNING-NON-BREAKING-SEMANTIC-ROLLOUT-PATTERN-2026-03-21-1543.md`

## Why challenge now
The rollout pattern worked for `reasonCode`, but success in one slice can hide scaling risks for future semantic additions.

## Main blind spots

### 1) Taxonomy creep risk
A small clean reason set can gradually bloat as edge cases appear, eroding clarity and consumer trust.

**Mitigation:** cap reason taxonomy growth per version and require explicit deprecation/upgrade notes when adding new categories.

### 2) Backward-compatibility illusion
Keeping old keys doesn’t guarantee stable behavior if semantics inside existing summaries shift.

**Mitigation:** freeze behavior-oriented golden tests for existing fields (`authorization.summary`, `officialEndpointDeclared`) alongside new reason tests.

### 3) Consumer over-coupling to early reason semantics
Integrators may hardcode first-wave reason codes as exhaustive truth.

**Mitigation:** document reason codes as extensible taxonomy and include defensive parsing guidance for unknown future values.

### 4) Verification scope can become too happy-path
Live checks that only confirm field presence may miss incorrect reason assignments under varied inputs.

**Mitigation:** add a compact live probe matrix (at least 2–3 input archetypes) to validate reason differentiation, not just existence.

## Red-team verdict
The pattern is directionally strong, but future semantic evolution needs explicit anti-creep controls, behavioral regression tests, and multi-input live validation.

## Stronger rule (proposed)
For each new semantic field iteration:
1. maintain taxonomy budget + version policy,
2. keep old-field behavior golden tests,
3. publish extensibility guidance for consumers,
4. verify live on a small differentiated input matrix.
