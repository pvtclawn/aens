# Fifth AENS slice — sharper discovery semantics (2026-03-19 02:12 UTC)

## Goal
Make AENS report output more honest by replacing the broad discovery boolean with explicit discovery/trust state lines.

## Slice
Retire the over-broad `Discovery surface present` line in favor of a small explicit state model:
- identity anchor present
- profile metadata present
- callable service surface present
- proof surface present
- capability authority (already present)

## Why this matters
This directly fixes the live contradiction exposed by `vitalik.eth`, where generic ENS profile richness could previously read like meaningful service discovery.

## What changed
- added explicit state helpers in `src/profile.ts`
- updated `src/report.ts` to print explicit discovery/trust state lines
- updated tests so profile metadata no longer implies callable discovery

## Non-goals
- no full trust-tier provenance labels yet
- no proof-language demotion yet
- no invocation flow yet

## Success criterion
A normal ENS profile with address + website/social metadata should report:
- identity anchor: yes
- profile metadata: yes
- callable service surface: no
- proof surface: no
- capability authorization: not-a-capability-surface
