# Learning — Chain-First Truth Boundary for ENS Automation (2026-03-21 22:38 UTC)

## Context
After freezing the chain-first thin-client + dogfooding-agent boundary, the practical question is how to automate publication without reintroducing hidden trust assumptions.

## Applied learning

### 1) “Automation authority” is not “truth authority”
An agent can automate page generation, write-plan construction, and verification runs; none of these are final truth until the resulting state is readable from ENS.

**Rule:** every agent action must terminate in a chain-readable post-state check, not a local success message.

### 2) UI trust drift starts with convenience defaults
Hardcoded defaults and fixture-first UX are useful during bootstrapping, but users quickly mistake them for live truth when both are shown in the same screen.

**Rule:** always label data source at render time (`live chain` vs `demo fixture`) and bias default display toward chain-derived fields.

### 3) Deterministic fixtures are for contract stability, not product proof
Fixture matrices are excellent for proving parser/contract behavior under controlled outcomes; they are not evidence that deployment is live-authorized.

**Rule:** pair deterministic fixture evidence with at least one live chain probe in the same acceptance packet.

### 4) Publish pipelines should expose intent and verification separately
If write intent, execution, and verification are collapsed into one opaque command, operators cannot audit what actually changed.

**Rule:** split dogfooding pipeline into explicit stages:
1. write-intent artifact,
2. execution step,
3. post-write chain verification report.

### 5) Reason semantics become the anti-confusion layer
Machine-readable `reasonCode` / `reasonSchemaVersion` provide a stable explanation boundary between “not authorized yet” and “system failure”.

**Rule:** keep semantic reason fields stable and treat taxonomy updates as versioned governance changes.

## Immediate implementation guidance
- Add source-labeling UI first (low risk, high trust gain).
- Keep thin-client reads chain-first; keep fixture mode explicit and non-default where possible.
- Define dogfooding agent output contract around verifiable artifacts, not implicit success states.
