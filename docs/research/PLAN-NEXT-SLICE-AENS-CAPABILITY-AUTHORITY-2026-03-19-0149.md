# Plan — next AENS slice after report red-team (2026-03-19 01:49 UTC)

## Purpose
Turn the new challenge findings into a small, ordered plan that strengthens ENS authority instead of merely polishing output.

## Constraint from the challenge
The red-team pass showed that current AENS is stronger as an ENS-native **trust debugger** than as an ENS-native **capability authority**.

So the next slices should be prioritized by this question:

> Does this make ENS a stronger authority structure, or does it only make the report prettier?

## Chosen plan (ordered)

### Task 1 — Parent-authorized capability surfaces **(NEXT TASK)**
#### Goal
Make ENS stronger than a discovery entrypoint by introducing explicit capability authorization.

#### Scope
- define a minimal root/capability profile relation
- let a parent agent profile declare official capability subnames
- let a capability profile point back to parent identity
- verify whether a capability surface is parent-authorized
- expose that verdict in the report/CLI

#### Acceptance criteria
1. A capability profile can declare:
   - its `parentName`
   - its `agentId` (or equivalent parent-matching identity field)
2. A parent profile can declare a list of official capability subnames.
3. The resolver/verifier can classify a capability surface as:
   - `parent-authorized`
   - `unlisted-child`
   - `identity-mismatch`
   - `not-a-capability-surface`
4. Unit tests cover at least:
   - authorized child
   - unlisted child
   - mismatched parent identity
5. CLI/report output includes explicit capability-authorization status.

#### Why this is first
This is the smallest slice that upgrades AENS from:
- ENS profile aggregation

toward:
- ENS-authorized agent/capability discovery.

That makes ENS materially more load-bearing.

---

### Task 2 — Trust-tiered report model
#### Goal
Stop flattening mixed evidence into one cheerful report.

#### Scope
Reorganize report output into layers such as:
- identity anchor
- capability authority
- linked proof surface
- live observation
- caveats / inferred-only claims

#### Acceptance criteria
1. Report lines carry provenance/tier labels.
2. The current `Discovery surface present: yes/no` boolean is replaced by sharper states.
3. Tests show durable ENS facts remain distinct from transient live observations.

#### Why this is second
This meaningfully reduces overclaim risk, but without Task 1 it mostly improves explanation rather than authority.

---

### Task 3 — Corroboration-aware proof language
#### Goal
Prevent shape-based receipt parsing from sounding like verification.

#### Scope
- reserve strong language for corroborated proofs only
- demote shape-only matches to inferred language
- prepare the model for later signer/hash/anchor corroboration

#### Acceptance criteria
1. Shape-only docs are labeled `inferred receipt-like` or equivalent.
2. Stronger labels require extra corroboration beyond field presence.
3. Tests prove that heuristic classification never prints `verified` by itself.

#### Why this is third
Important for trust safety, but it is still downstream of the bigger authority gap.

## Single next task
# **Build Task 1 — Parent-authorized capability surfaces**

### Smallest mergeable slice
Do not build full invocation or payments yet.
Just add:
- parent capability list,
- child capability identity link,
- authorization classification,
- tests,
- report output.

## What to avoid next
- no broad README rewrite first
- no UI prettification first
- no service invocation first
- no payment/gating first

Those can follow once capability authority exists.

## Bottom line
The next milestone should not ask whether AENS can fetch more things.
It should ask whether AENS can say, with a straight face:

> this ENS capability surface is officially authorized by its parent identity.
