# ENS App first — root phase default (2026-03-20 19:19 UTC)

## Purpose
Freeze one narrow operational simplification for the **first live root phase** of ÆNS.

Question:
- after resolver modernization on `pvtclawn.eth`, should the session expect to bounce immediately between ENS App and `tools.ens.xyz`?
- or is there a cleaner default posture for the first live run?

## Short answer
### Default to **ENS App first** after moving the name onto the latest ENS Public Resolver.
Use `tools.ens.xyz` only as a fallback if editability still fails or the ENS App cannot perform the needed record edits cleanly.

## Evidence checked
External ENS docs/support pages reviewed:
1. `How to Update the Resolver Record`
2. `tools.ens.xyz – Lightweight side tools`
3. ENS Public Resolver docs

These are external/untrusted sources in the security sense, but they are still useful for narrowing expected operator behavior.

## What the docs imply
### 1) ENS App record editing depends on using the Public Resolver
The resolver article says:
- if the resolver is empty or incorrectly set, ENS App record-editing functionality is not available
- ENS App editing works when using the Public Resolver
- wrapped names need the current ENS Public Resolver in ENS App

Operational implication:
- the resolver modernization step is not just cosmetic
- it is the prerequisite that should make ENS App editing the default path again

### 2) `tools.ens.xyz` is positioned as a side-tool/fallback surface
The tools article says:
- `tools.ens.xyz` exposes ENS contract functions not available in the main ENS App
- `Set ENS Records` is for updating records when the main ENS App isn’t available
- it is also required in some wrapped-name / separate Public Resolver manager cases

Operational implication:
- `tools.ens.xyz` should not be treated as the primary planned path if ENS App editing becomes available after the resolver update
- it should be the fallback surface when the official edit path still does not behave cleanly

## Updated practical default for the first live root phase
### Preferred operational posture
1. use ENS App to update the resolver to the current Public Resolver
2. stay in ENS App first and try to set:
   - ETH address
   - description
   - any editable text records available there
3. move to `tools.ens.xyz` only if the needed `aens.*` records or editability still fail to behave cleanly in ENS App after the resolver change

## Why this matters
This sharpens the opening root phase without denying the real multi-surface risk.

The root phase is still:
- one continuous goal
- resolver update first
- root records immediately after

But the most honest default is now:
- **ENS App first, tools only if needed**

That is better than mentally planning a multi-surface dance from the start if the official ENS App path may actually work cleanly once the resolver is modernized.

## What this does **not** claim
This note does **not** prove that the first live session will stay entirely inside ENS App.
Real wrapped-name quirks or UI friction may still force `tools.ens.xyz` use.

It only sharpens the default expected posture:
- do not assume fallback surfaces too early
- give the Public Resolver + ENS App path a fair first attempt

## Suggested operator interpretation
For the first live session:
- treat `tools.ens.xyz` as the **contingency surface**, not the planned primary surface
- if ENS App still fails to expose the needed post-resolver editing cleanly, then treat that as the named root-phase friction case and continue carefully rather than improvising

## Bottom line
The best current operational default for the first live root phase is:
- **latest Public Resolver → ENS App first → `tools.ens.xyz` only if editability still fails**

That simplifies the mental model of the first live session while staying honest about fallback risk.

## Core delta
None.
This note does not change the parent/child authorization model.

## Rail delta
Moderate.
This sharpens first-live-session execution posture only.

## Counterfactual relevance test
Would this note still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution research, not protocol-center progress.
