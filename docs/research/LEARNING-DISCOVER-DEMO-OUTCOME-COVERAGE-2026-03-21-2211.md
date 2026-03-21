# Learning — Discover Demo Outcome Coverage (2026-03-21 22:11 UTC)

## Context
The multi-example research pass showed a surface mismatch: the shared fixture registry exposes three authority examples, but discover CLI only accepts examples whose child ENS is `research.*`. Result: only one deterministic discover demo path is currently usable.

## Applied learning

### 1) Fixture breadth is meaningless unless it is **surface-compatible**
A registry can look rich while a consumer surface still behaves like single-example mode.

**Rule:** measure demo coverage by *consumer-valid outcomes*, not by total fixture IDs in shared registry.

### 2) Discover demos should be modeled by **decision outcomes**
For discover-research, useful coverage is not “many names,” it is these machine-meaningful states:
1. parent-authorized + endpoint declared,
2. child found but not fully authorized,
3. child missing,
4. failure contract (`lookup-failed` shape under gated probe conditions).

**Rule:** each outcome should have exactly one canonical deterministic fixture path.

### 3) Keep authority fixtures and discover fixtures decoupled
Capability-general fixtures are still valid for authority/report surfaces, but discover CLI has stricter assumptions (`research.*`). Trying to force one fixture set for both surfaces creates hidden incompatibility.

**Rule:** maintain two lightweight layers:
- **core authority fixtures** (cross-surface),
- **discover fixtures** (research-prefixed, discover-consumable).

### 4) Demo reliability improves when timeout semantics are treated as first-class outcome
A usable agent demo needs both success and failure paths with structured meaning.

**Rule:** preserve default-off safety for failure probes, but keep one deterministic, controlled way to verify `lookup-failed` payload shape.

## Immediate guidance before implementation
- Do not mutate existing authority fixture IDs.
- Add minimal discover-specific fixtures for partial/missing states.
- Keep output schema unchanged; expand only deterministic discover coverage.
- Validate discover fixture set via one CLI matrix command in docs.
