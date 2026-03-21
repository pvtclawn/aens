# Learning Note — Stable Contracts vs Semantic Richness (2026-03-21 15:17 UTC)

## Context
The discover service now returns a stable v1 contract in production, but recent probes showed semantically flat outputs for different ENS inputs.

## Applied learning

### 1) Stability and richness are separate axes
A response can be structurally reliable (`source`, fixed keys, parseable JSON) while still under-informative for downstream decisions.

### 2) Contract safety should not block semantic improvements
You can increase utility without breaking consumers by adding optional, backward-compatible fields (e.g., `reasonCode`) while preserving existing keys.

### 3) Agent-facing endpoints need decision-shaping semantics
For agents, “why this status happened” often matters as much as the status itself.
Flat statuses force extra inference layers and increase integration ambiguity.

### 4) Improve semantics in thin, testable increments
Best pattern:
1. keep v1 schema stable,
2. add one non-breaking reason field,
3. add deterministic tests for reason classification,
4. verify live output still parses for existing consumers.

## Reusable rule
Treat service quality as a two-gate check:
1. **Contract gate** — stable, parseable, backward-compatible.
2. **Decision gate** — enough semantic signal for consumers to act without extra heuristics.

## Main takeaway
For agent services, “stable JSON” is necessary but not sufficient; usefulness comes from stable contracts plus minimally sufficient semantic reasons.
