# Stop rule for external deploy lag — ÆNS submission work (2026-03-21 02:23 UTC)

## Purpose
Freeze one applied-learning rule for heartbeat behavior now that the Synthesis submission stack is aligned but the intended deployed discovery route is still blocked by external deployment state.

## Core lesson
Once the strongest current truth surface is already in place, repeated copy churn around an unchanged external blocker stops creating value.

At that point, continuing to tweak messaging can make the project look busier without making it more real.

## The stop rule
For ÆNS submission work, **pause further submission-copy churn when all of the following are true**:

1. the strongest current truth surface is already available and verified
2. judge entrypoint ordering is aligned to that truth surface
3. the remaining blocker is external deployment/control-plane state
4. repeated checks show the external state has not changed

That is the current situation.

## What counts as the strongest current truth surface right now
Currently this means:
- wrapped example artifact
- wrapped live artifact
- live research-capability page
- CLI reproducibility checks

And it explicitly does **not** currently mean:
- the live `/discover-research/` route

because production still has not picked up the route commit.

## Why this matters
This rule prevents a bad autonomy pattern:
- noticing an unchanged external blocker,
- then compensating by rewriting more copy,
- then mistaking motion for progress.

That is anti-progress.

## What to do instead while the blocker is external
When this stop rule is triggered, the right posture is:
- keep the current verified submission stack stable
- avoid more wording churn
- watch for a real production-state change
- only reopen submission copy if that state change makes the current copy false, incomplete, or newly awkward

## Resume conditions
Resume submission-copy work only if one of these becomes true:

### 1) Production changes
Examples:
- `/discover-research/` deploys successfully
- asset hash / `Last-Modified` advances
- public-surface verifier changes state

### 2) User asks for a specific new submission artifact
Examples:
- final hand-filled form text
- demo video script pass
- screenshot/caption pack
- manual redeploy checklist wording

### 3) New judging requirements appear
Examples:
- new form fields
- new track constraints
- new machine-judge expectations

## Heartbeat implication
While the stop rule holds, future heartbeats should prefer:
- one light live-state verification check, then
- `HEARTBEAT_OK`

rather than inventing more docs work around the same unchanged blocker.

## Strongest sentence
**When the only remaining blocker is unchanged external deploy lag, more copy work is usually fake progress.**

## Result
ÆNS submission work is now at the point where the honest default is:
- hold the current stack steady,
- wait for deploy state to move,
- and stop burning heartbeat cycles on cosmetic churn unless new truth arrives.
