# Challenge — publisher-assist pre-write gate risk (2026-03-20 18:34 UTC)

## Purpose
Red-team the newly frozen operational role for publisher-assist v1 in the first live ENS write session.

Current role:
- use `bun run publish-assist` as a **re-runnable pre-write gate** between verified phases
- do not use it as the runbook itself
- do not use it as a session manager

This role is plausible.
But it can still fail in several specific ways.

## Weakness 1 — observed-truth lag can make the gate look wrong at exactly the worst moment
The tool is deliberately anchored to fresh read-side truth.
That is the right design.
But immediately after a human-approved write, that read-side truth may not yet look coherent.

Risk:
- the operator may run publisher-assist too early after clicking approve
- the tool may still classify the previous state
- the operator may then distrust the gate or retry writes unnecessarily

Mitigation:
- keep publisher-assist downstream of the explicit verification commands, not directly downstream of wallet approval clicks
- when observed truth is mixed or lagged, prefer `needs-operator-reconcile`, not optimistic advancement
- future output could explicitly remind the operator that the gate reflects observed truth, not browser optimism

## Weakness 2 — `next legal step` can get mistaken for the whole phase script
The tool prints one clean next step.
Humans love clean next steps.

Risk:
- Egor may begin treating publisher-assist as the whole session guide
- but phase-specific write payload details still live in the runbook
- that creates a silent missing-context problem instead of a clear handoff

Mitigation:
- keep the role note explicit: publish-assist is the gate, not the phase script
- future versions may print state-specific pointers or payload summaries, but v1 should not pretend it already does that
- avoid product language that makes `next legal step` sound like `everything you need is here`

## Weakness 3 — generic human-review prompts may be too weak for the riskiest writes
Current v1 prompts are intentionally generic.
That keeps the tool small.
But some writes deserve more specific scrutiny.

Risk:
- resolver modernization and parent capability authorization do not feel like the same kind of risk in practice
- generic prompts may become skimmed boilerplate during the real session

Mitigation:
- treat generic prompts as a v1 floor, not a full safety story
- if the first live session exposes real friction here, the next small improvement should be state-specific review prompts for the highest-risk writes
- do not solve this by expanding the whole state machine unnecessarily

## Weakness 4 — a useful gate can still turn into ceremony if invoked too often
The role note already tries to prevent this.
But practice matters more than notes.

Risk:
- the operator may start running the tool between every substep because it feels responsible
- that creates bureaucracy rather than sharper phase boundaries
- the UX answer to the publish problem would then become a new source of friction

Mitigation:
- keep the invocation boundary strict:
  - session start
  - after root verification
  - after child verification
  - after parent authorization
  - optional post-final confirmation
- do not normalize running it after every browser click

## Weakness 5 — the gate can still sound more authoritative than it really is
Even read-only guidance can produce automation bias.
The wording `next legal step` is strong.

Risk:
- the human may psychologically convert guidance into permission
- this is dangerous at the wallet boundary where real judgment is still irreducible

Mitigation:
- keep `human review required` visually tied to the next-step output
- prefer language that implies guidance, not machine permissioning
- if a future UX refactor changes output tone, preserve this boundary deliberately

## Core delta
None.
This challenge does not change the parent/child authorization model.

## Rail delta
Moderate.
This is a critique of how publisher-assist v1 is used in the first live session.

## Counterfactual relevance test
Would this challenge still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution/product challenge work, not protocol-center progress.

## Bottom line
Publisher-assist as a pre-write gate is the right role only if it stays:
- downstream of verification
- subordinate to the runbook
- small enough not to become ceremony
- explicit that human judgment still owns wallet approval

## Best next move
If the first live session is run, watch specifically for:
1. too-early re-runs after writes
2. missing phase-detail expectations
3. generic review prompts feeling too weak
4. the tool being run too often and becoming ritual

If those problems appear, tighten role/UX boundaries before adding more state-machine complexity.
