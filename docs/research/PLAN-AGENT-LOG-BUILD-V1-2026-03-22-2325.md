# Plan — `agent_log.json` Build v1 (2026-03-22 23:25 UTC)

## Why this plan exists
The `agent_log.json` schema is now defined well enough that the next blocker is no longer structure.
The next blocker is execution discipline:
- what exactly to include
- what exactly to leave out
- how to keep the artifact honest under time pressure

This plan turns the schema note into one shippable build slice.

## Current health boundary
Repo state at planning time:
- `git status -sb` -> `## main...origin/main [ahead 1]`

So the next slice can be additive and local without first untangling a dirty tree.

## Goal
Ship one truthful machine-readable execution log artifact at:
- `docs/submission/artifacts/agent_log.json`

The artifact should improve judge clarity for the `🤖 Let the Agent Cook — No Humans Required` track without widening claims beyond what ÆNS actually proved.

## Scope
### In scope
- a compact two-run execution log
- structured steps with timestamps, tools, artifacts, results, and concise notes
- real blockers, retries, and inconsistent outcomes preserved
- links to already-public repo/deploy/submission artifacts where useful

### Out of scope
- chain-of-thought style reasoning
- secret-bearing command output
- raw API tokens or payload secrets
- every tiny heartbeat note from the day
- claims of autonomous wallet signing
- generalized capability claims outside the shipped ÆNS flow

## Run set to include
### Run 1 — `synthesis-publish-2026-03-22`
#### Goal
Create, custody-rescue, publish, and verify the ÆNS Synthesis submission.

#### Minimum required steps
1. create draft project
2. first publish attempt blocked by self-custody requirement
3. inspect participant/team state
4. initiate transfer to PrivateClawn wallet
5. observe timeout / underpriced replacement noise
6. re-check authoritative participant state
7. verify self-custody flipped
8. publish project successfully
9. verify project appears publicly

#### Run status target
- `completed_with_retries`

### Run 2 — `post-publish-strengthening-2026-03-22`
#### Goal
Improve visible judge-facing submission state after publication.

#### Minimum required steps
1. attach extra tracks
2. verify four-track state
3. post full payload update
4. surface demo video URL
5. surface `agent.json` via visible `helpfulResources`
6. attempt `conversationLog` update
7. record readback inconsistency (`POST accepted`, `GET null`)
8. adapt strategy to the JSON-first judge surface

#### Run status target
- `completed_with_known_inconsistency`

## Step schema requirements
Every step must include:
- `timestamp`
- `kind`
- `summary`
- `tools`
- `result`

Use `artifacts` and `notes` when they improve verification clarity.

## Acceptance criteria
The build slice is complete only if:
1. `docs/submission/artifacts/agent_log.json` exists
2. JSON parses cleanly
3. both runs are present
4. at least one retry/blocker is preserved explicitly
5. the `conversationLog` inconsistency is preserved explicitly
6. the artifact does not claim autonomous wallet signing
7. one compact receipt note explains what shipped and why it is truthful

## Smallest shippable implementation order
1. write the top-level manifest + run skeleton
2. fill Run 1 with real timestamps/outcomes
3. fill Run 2 with real timestamps/outcomes
4. validate JSON
5. add compact receipt note
6. commit as one slice

## Anti-drift rule
If any step detail cannot be backed by today’s recorded evidence, omit it or mark it as a concise note with uncertainty.
The artifact must read like compressed truth, not reconstructed mythology.
