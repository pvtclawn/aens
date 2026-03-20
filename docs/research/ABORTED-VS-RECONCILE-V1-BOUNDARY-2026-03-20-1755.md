# Aborted vs reconcile — publisher-assist v1 boundary (2026-03-20 17:55 UTC)

## Purpose
Resolve the remaining narrow design ambiguity from the publisher-assist v1 verification:
- should `aborted` stay as a distinct v1 terminal state?
- or should `needs-operator-reconcile` be the single honest divergence state for the current read-only CLI?

## Current truth
At note time:
- publisher-assist v1 is a **read-only**, stateless CLI
- it derives current state from fresh ENS/public/artifact evidence on each run
- it does not hold interactive workflow memory
- it does not execute writes
- it does not mediate wallet prompts
- the verification note found `needs-operator-reconcile` to be real and demonstrated
- the verification note did **not** find `aborted` to be a clearly load-bearing, realistic v1 path

## Core decision
### For the current read-only v1, `needs-operator-reconcile` should be treated as the single honest divergence state.

Why:
- v1 is not an interactive session manager
- v1 does not own the write loop
- v1 cannot observe user intent strongly enough to distinguish `abort` from `come back later and re-read truth`
- most real v1 failures are epistemic mismatches, not tool-owned workflow terminations

So when the tool sees contradictory or insufficient truth, the honest answer is:
- **reconcile current reality first**

not:
- pretend the tool can authoritatively declare a workflow-level abort state it does not actually control

## What `needs-operator-reconcile` means in v1
It means one of these is true:
- current public truth does not support the preferred-mode story
- root/child ENS reads failed or are contradictory
- child/root identity data disagree
- the observed publish state is out of order
- tool expectations and live truth no longer line up cleanly

The correct operator action is then:
1. stop approving writes
2. re-read root/child/public truth
3. reconcile the mismatch
4. re-run the tool from fresh evidence

That fits the actual shape of a stateless read-only assistant.

## Why `aborted` is weak in v1
A true `aborted` state implies some stronger ownership of workflow state than v1 currently has.
Examples of what would make `aborted` more meaningful:
- the tool initiated a guided session and the operator explicitly canceled it
- the tool tracks a previously selected state path and must mark it intentionally terminated
- the tool observes a hard terminal condition that makes the session non-resumable without explicit restart

Current v1 has none of those properties.
It just derives present truth from scratch.
So `aborted` is currently closer to a defensive catch-all label than a real product concept.

## Recommended interpretation
### For docs/product language right now
Treat divergence semantics as:
- **primary v1 divergence terminal state:** `needs-operator-reconcile`

Treat `aborted` as:
- reserved for future interactive/sessionful versions
- or reserved for an explicit operator-triggered abort action if that is later introduced

## Product implication
This simplifies v1 semantics:
- happy-path states remain as-is
- divergence state remains honest and demonstrated
- the product avoids pretending to own more workflow state than it really does

This also keeps the model smaller, which matches the anti-bloat goal from the challenge note.

## Suggested next implementation posture
For the next adjacent refinement, choose one of these explicitly:

### Option A — v1 simplification (preferred)
- remove `aborted` from the read-only v1 state model
- make `needs-operator-reconcile` the only divergence terminal state
- update tests/docs accordingly

### Option B — keep `aborted` only as future-facing scaffolding
- leave `aborted` in code temporarily
- but document that it is not yet load-bearing in read-only v1
- do not build more product semantics around it until an interactive/sessionful assist exists

## Best current answer
**Option A is cleaner** for the current product truth.
It matches what the tool really is today.

## Bottom line
For the current read-only publisher-assist v1:
- `needs-operator-reconcile` is the honest divergence state
- `aborted` is not yet a real, demonstrated product state
- the smallest truthful model is to center reconcile and demote abort until the tool actually owns interactive workflow state
