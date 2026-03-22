# Plan — Truthful Agent Artifacts v1 (2026-03-22 22:52 UTC)

## Why this plan exists
ÆNS is now attached to `🤖 Let the Agent Cook — No Humans Required`, and the highest remaining judge-facing gap is no longer generic submission polish.

It is the absence of the two machine-readable artifacts the track explicitly names:
- `agent.json`
- `agent_log.json`

At the same time, the red-team pass already established the main danger:
- these artifacts help only if they are **compressed truth**, not backfilled autonomy theater

## Current health boundary
Repo state at planning time:
- `git status -sb` -> `## main...origin/main [ahead 17]`
- plus existing uncommitted modifications in:
  - `SYNTHESIS.md`
  - `docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md`
  - `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
  - `docs/submission/SYNTHESIS-TRACK-FIT-2026-03-21.md`

This means the next slice should avoid destructive cleanup and should ship as a narrow additive artifact pass.

## Task 1 — Build a truthful `agent.json`
### Goal
Create a machine-readable manifest that matches what ÆNS and PrivateClawn actually do now.

### Must include
- agent name / identity
- operator wallet / ERC-8004 context
- actual tool stack
- concrete task categories
- explicit guardrail limits
- compute/resource constraints in honest qualitative terms

### Must not claim
- autonomous wallet signing
- generalized ENS publishing beyond the shipped flow
- capabilities that do not exist in the current app + submission workflow

### Acceptance criteria
- file exists in a judge-facing public location inside `aens/`
- JSON parses cleanly
- capabilities/limits match current live app + submission truth
- at least one note/research artifact references it as canonical

## Task 2 — Build a truthful `agent_log.json`
### Goal
Create a structured execution-log artifact for one or two real autonomous loops already evidenced in today’s work.

### Recommended loops
1. Synthesis submission + custody + publish path
2. post-publish verification / track expansion / conversation-log update path

### Must include
- timestamps
- goal / action / evidence / result steps
- retries and blockers
- verification checkpoints
- explicit limits when a result stayed ambiguous

### Must not do
- flatten the process into a fake-perfect run
- erase the conversation-log readback inconsistency
- hide custody/deploy ambiguity that actually happened

### Acceptance criteria
- file exists in a judge-facing public location inside `aens/`
- JSON parses cleanly
- at least one blocker/retry remains visible in structured form
- the artifact increases clarity relative to the current scattered notes

## Task 3 — If both artifacts land, patch visible submission framing
### Goal
Use the new artifacts to improve the live submission only if the artifacts are already real.

### Candidate follow-up edits
- add manifest/log links into visible submission copy or artifact references
- tighten description/problem statement toward:
  - autonomous loop
  - multi-tool use
  - explicit guardrails
  - ERC-8004 identity

### Acceptance criteria
- only proceed if Tasks 1 and 2 are done truthfully
- no speculative claims are introduced
- submission stays aligned with live app reality

## Smallest shippable next move
**Task 1 first** — `agent.json`

Why:
- easiest high-value artifact to add cleanly
- lets the next slice define scope/limits before the log artifact is shaped
- lowers the risk of `agent_log.json` overclaiming capability surface

## Anti-drift rule
Do not spend the next slice on more internal notes about why these artifacts matter.
The next work should either:
- produce the truthful artifact(s), or
- explicitly document a concrete blocker to producing them honestly.
