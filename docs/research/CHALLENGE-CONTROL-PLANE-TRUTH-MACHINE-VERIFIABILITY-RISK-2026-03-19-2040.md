# Challenge — control-plane truth vs machine-verifiability risk (2026-03-19 20:40 UTC)

## Purpose
Red-team the new trust rule:

> human-controlled deployment control planes are part of the service-trust surface when they can change what the public alias serves

The question now is not whether that rule is true.
It is whether the **first live ÆNS proof story** could still overstate machine-verifiability even after adopting it.

## Verdict
### Yes — the conceptual model is now honest, but the proof story can still sound too machine-closed.

The recent work solved the important structural confusion:
- preferred/public truth is distinct from source/build truth
- the control plane is now recognized as part of the trust surface
- bootstrap proof readiness is distinct from preferred-route readiness

But there is still a subtle risk that the first live proof gets narrated as if the entire system were already machine-verifiable end to end.

The honest current state is narrower:
- some parts are machine-verifiable
- some parts are public-state-observable
- some parts are still gated by a human-controlled deployment control plane

If those layers are not stated plainly, the proof can still look cleaner than it really is.

## Weakness 1 — machine-closure overclaim
The current verifier and proof artifacts correctly encode publication state.
But they still do not foreground one critical distinction:
- **which claims are machine-verifiable**
- **which claims are only currently observed at the alias**
- **which claims are blocked on unresolved human control-plane state**

### Why this matters
A reader can still infer too much from a tidy artifact:
- ENS identity and capability authority look rigorous
- bootstrap proof snapshot looks rigorous
- therefore the whole service story can feel machine-closed

That conclusion would be too strong.

### Mitigation
Live-proof docs and summaries should explicitly split:
1. machine-verifiable identity/capability scope
2. observed public-state scope
3. unresolved control-plane scope

## Weakness 2 — retroactive alias drift
Even once the preferred route is repaired, the same alias can later serve a different artifact because of a new dashboard-side deployment action, without any ENS record change.

### Why this matters
A later reader may revisit the same alias and mentally project the new served artifact backward onto the earlier proof.
That can blur what was actually proven at the time of the first publication.

### Mitigation
Treat live proof artifacts as **time-scoped public-state snapshots**.
At minimum, record:
- fetch time
- URL
- response metadata (ETag / Last-Modified when available)
- publication-state verdict at capture time

## Weakness 3 — control-plane transition opacity
The future step that repairs the preferred route may happen through a dashboard-side action with no equivalent onchain trace and no guaranteed repo trace.

### Why this matters
The overall project value system says “verifiable build.”
But one causally important transition can still occur in an opaque human-operated interface unless it is explicitly recorded.

### Mitigation
When the preferred route is eventually fixed, capture the control-plane transition itself as evidence:
- deployment URL or deployment ID
- timestamp of the change
- post-change `bun run check-public-surface` output
- optional screenshot/note if that is the only practical evidence

Longer-term, ÆNS should treat control-plane transitions as first-class proof events when they materially change public truth.

## Weakness 4 — bootstrap permanence
Because bootstrap mode is now clearly valid, there is a temptation to leave it there and silently stop caring about the preferred-route closure.

### Why this matters
That would turn a deliberately narrow bootstrap proof into a quiet long-term substitute for the better capability surface.
The system would stay honest at the small scale while drifting from its stronger intended trust shape.

### Mitigation
Keep bootstrap mode visibly temporary:
- describe it as bootstrap-only in proof wording
- track preferred-route closure as explicit follow-up debt
- avoid copy that sounds like bootstrap mode is the final intended product state

## Weakness 5 — mixed-layer summary compression
A concise demo or proof post can easily flatten:
- source truth
- build truth
- control-plane truth
- public truth

back into one vague “the route is basically fixed” story.

### Why this matters
This is exactly how honest nuance disappears when moving from engineering notes to user-facing proof language.

### Mitigation
Use layered trust wording consistently in any future operator/proof summary:
- `machine-verifiable identity/capability authority`
- `human-controlled deployment state`
- `current public alias state`

Avoid one-line proof copy that hides those categories.

## Bottom line
The new control-plane-truth rule is the right conceptual fix.
But the first live proof can still overstate machine-verifiability unless it says plainly:
- what is machine-verifiable now
- what is only publicly observed now
- what is still unresolved because a human control plane has not yet promoted the intended build

## Best next move
The next useful slice is not more deployment forensics.
It is a small proof-language hardening slice:

### Proof-scope wording hardening
Make the first live proof explicitly separate:
1. machine-verifiable identity/capability claims
2. observed public-alias state
3. unresolved human control-plane state

That would make the proof story harder to misread even before the preferred route is fixed.
