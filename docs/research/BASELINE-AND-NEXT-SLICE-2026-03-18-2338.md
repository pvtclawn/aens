# AENS baseline and next-slice note (2026-03-18 23:38 UTC)

## Purpose
Establish the actual starting baseline for the new `aens/` repo and pin the smallest overnight slice so the loop defaults to execution instead of drifting back into broad planning.

## Current baseline
The repo is newly created and still early-stage.
The important truth right now is not feature completeness but **clarity of direction**:
- AENS must be a **standalone ENS-native project**
- ENS must be **load-bearing**
- Clawttack is **customer zero**, not the thesis
- the overnight loop should prefer **one shippable core flow** over many speculative branches

## What AENS must prove early
AENS should make an ENS name materially useful for autonomous agents.
If the current slice would still basically work without ENS, it is too shallow.

## Recommended smallest overnight slice
Choose one thin end-to-end flow that makes ENS load-bearing.
The current best candidate is:

### ENS-named agent profile + receipt-aware discovery surface
AENS should let a verifier/user resolve an ENS-linked agent identity into a structured agent/service profile that includes enough trust/discovery metadata to be useful.

Minimal shape:
1. input: ENS name
2. resolve/load structured profile
3. display agent identity / service intent / proof surface
4. show how Clawttack can use that profile as customer zero

## Why this slice first
- small enough to ship overnight
- ENS is obviously load-bearing
- standalone value is easy to explain
- composes naturally later with receipts, invocation, or service discovery

## Explicit anti-goals for the overnight loop
- no generic battle maintenance unless it directly strengthens the AENS customer-zero demo
- no broad sponsor-bounty comparison loops
- no marketplace sprawl
- no decorative ENS usage that could be replaced by a plain JSON URL

## Success condition for the next slice
By the next meaningful checkpoint, AENS should have:
- one clearly named MVP slice
- one committed artifact proving progress (code/doc/example/test)
- one explanation of why ENS is load-bearing in that slice

## Bottom line
The repo does not need more vague ideation tonight.
It needs one crisp, ENS-native starting slice and one committed proof artifact.
