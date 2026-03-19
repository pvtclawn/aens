# Plan — core delta / rail delta rule (2026-03-19 21:38 UTC)

## Purpose
Freeze one narrow planning rule that turns the newest anti-drift insight into a practical prioritization filter.

Recent work already established:
- the core ÆNS wedge is still **parent-authorized child capability authority**
- supporting trust rails must remain subordinate to that protocol core
- wording order alone is not enough to prevent drift

The newest challenge exposed the remaining risk:
- a future slice can still *sound* capability-centered while spending most of its actual energy on supporting rails in practice

This plan prevents that by forcing future slices to declare their two kinds of progress explicitly.

## Decision
### Every future ÆNS slice should state **core delta** and **rail delta** separately.

This is not bureaucracy for its own sake.
It is a way to stop support-rail elaboration from quietly masquerading as protocol-center progress.

## Definitions

### Core delta
What became more load-bearing, legible, or enforceable about the core authority model:
- parent identity
- child capability
- authorization relationship
- meaning of `parent-authorized`
- capability semantics that depend on the ENS hierarchy itself

A slice has real core delta if it makes the child-capability-under-parent model clearer, stronger, or harder to fake.

### Rail delta
What became better about the supporting trust/platform rails around that model:
- proof capture
- public-state verification
- deployment/control-plane evidence
- transition receipts
- operator/reporting layers
- support UX for observing or preserving causal history

A slice can have meaningful rail delta even when the authority model itself is unchanged.

## Rule for future slice plans
Every plan/research note for a future slice should answer these two questions explicitly:

1. **Core delta:** what concrete change does this make to the parent/child capability authority model?
2. **Rail delta:** what concrete change does this make to supporting proof/public-state/provenance rails?

If the second answer is much stronger than the first, the slice should be labeled and prioritized as **supporting work**, not protocol-center work.

## Priority rule
### High-priority / protocol-center slice
Treat a slice as protocol-center progress only if it has meaningful core delta.

Examples:
- stronger interpretation of child capability semantics
- sharper authority classification
- more load-bearing parent/child authorization logic
- better capability-specific trust meaning anchored in ENS hierarchy

### Supporting slice
Treat a slice as supporting work if it has mostly rail delta.

Examples:
- richer proof artifacts
- better public-state summaries
- better deployment/control-plane evidence
- richer transition receipts
- nicer operator/reporting ergonomics

Supporting slices can still be worth shipping.
But they should not quietly consume the project center of gravity.

## Acceptance criteria for future slices
A future slice is acceptable as **protocol-center progress** only if all of these are true:

### A. Core delta is explicit
The slice note clearly states what became more load-bearing about:
- parent identity
- child capability
- authorization relationship

### B. Rail delta is explicit
The slice note clearly states what supporting trust/public-state/provenance rails improved.

### C. Label matches the real balance
If `rail delta >> core delta`, the slice is labeled as supporting work.
It is not presented as a major protocol advance.

### D. The slice still depends on the ÆNS wedge
If the slice would make just as much sense without the child-capability-under-parent model, that is a strong sign it is rail-heavy.
The note should acknowledge that and treat it as supporting work.

### E. Repo health stays clean
- `bun test`
- `bunx tsc --noEmit`

## Explicit non-goals
This rule does **not** say:
- stop building support rails
- receipts/proof/public-state work are unimportant
- every slice must move the authority model directly

It only says:
- do not confuse supporting progress with core protocol progress

## Minimal implementation shape
Do not build a big framework for this.
The smallest useful move in future planning/docs is enough:
- add `Core delta` and `Rail delta` headings to slice plans/notes when relevant
- use them honestly
- let prioritization follow from the balance

## Why this is the right next move
The current drift risk is no longer rhetorical.
It is allocation drift.

This rule is small, cheap, and sharp:
- it keeps the project centered on the ENS-native capability-authority wedge
- it still allows good supporting work
- it makes future drift visible earlier

## Bottom line
ÆNS should keep building both:
- core authority-model progress
- supporting trust rails

But future slices must say which one they are actually advancing.
If `rail delta >> core delta`, that slice is supporting work — useful, but not the protocol center.
