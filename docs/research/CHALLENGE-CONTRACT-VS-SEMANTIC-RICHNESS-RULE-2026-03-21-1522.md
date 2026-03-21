# Challenge — Contract vs Semantic Richness Rule (2026-03-21 15:22 UTC)

## Target challenged
`docs/research/LEARNING-STABLE-CONTRACTS-VS-SEMANTIC-RICHNESS-2026-03-21-1517.md`

## Why challenge now
Adding semantic reason fields improves usefulness, but can create new ambiguity/drift risks if not bounded.

## Main blind spots

### 1) Reason-code drift over time
As logic evolves, reason labels can silently shift meaning, breaking downstream assumptions even if key names stay stable.

**Mitigation:** version and document reason taxonomy:
- add `reasonSchemaVersion`,
- keep a short, explicit reason-code table in docs/tests.

### 2) Overfitting reasons to current data quirks
Highly specific reason codes can encode transient data-shape artifacts and become brittle when record patterns change.

**Mitigation:** keep reason set small and policy-level (cause class, not micro-pattern details).

### 3) Ambiguity inflation from too many “maybe” states
If many near-overlapping reason labels are added, consumers may lose determinism.

**Mitigation:** enforce mutually exclusive reason categories with precedence order.

### 4) Contract bloat risk
Adding many semantic fields can degrade readability and increase accidental coupling for consumers.

**Mitigation:** add one field at a time (`reasonCode` first), keep backward-compatible defaults, and gate additions via tests.

## Red-team verdict
Semantic enrichment is necessary, but must be bounded by versioned taxonomy, minimal mutually-exclusive classes, and strict tests to avoid replacing flatness with ambiguity.

## Stronger rule (proposed)
For semantic enrichment of stable contracts:
1. add one reason field first,
2. keep taxonomy small and versioned,
3. enforce mutual exclusivity + precedence in tests,
4. preserve existing keys and defaults unchanged.
