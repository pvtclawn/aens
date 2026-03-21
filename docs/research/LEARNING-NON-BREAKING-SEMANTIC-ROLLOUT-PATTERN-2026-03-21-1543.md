# Learning Note — Non-Breaking Semantic Rollout Pattern (2026-03-21 15:43 UTC)

## Context
The discover service moved from runtime-blocked to live, then gained additive semantic richness (`reasonCode`) without breaking existing contract consumers.

## Applied learning

### 1) Sequence matters: availability before enrichment
Trying to enrich semantics before stabilizing runtime/deploy availability would have increased ambiguity. First ensure endpoint is live, then add semantic fields.

### 2) Additive-only semantic changes are the safest first move
Keeping existing keys unchanged while adding `reasonCode` + `reasonSchemaVersion` preserved backward compatibility and reduced migration risk.

### 3) Thin taxonomy beats ambitious ontology in v1
A small mutually-exclusive reason set delivered immediate utility without overfitting or exploding integration complexity.

### 4) Test-first semantics prevent accidental drift
Deterministic classification tests (precedence + exclusivity) turned semantic behavior into an explicit contract, not implicit implementation detail.

### 5) Live verification must check both compatibility and new value
A good rollout check answers both:
- did old consumers remain safe?
- did new consumers gain actionable semantic signal?

## Reusable pattern
For future agent-service enrichments:
1. stabilize runtime availability,
2. add one backward-compatible semantic field,
3. codify taxonomy in tests,
4. verify live contract + semantic presence,
5. iterate in small additive slices.

## Main takeaway
The most reliable way to improve agent-facing APIs is progressive enrichment: stable contract first, then minimal semantic lift, each backed by deterministic tests and live verification.
