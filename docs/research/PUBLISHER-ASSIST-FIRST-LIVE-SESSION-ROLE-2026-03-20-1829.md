# Publisher-assist role in the first live ÆNS session (2026-03-20 18:29 UTC)

## Purpose
Freeze the exact role the new read-only `publish-assist` CLI should play in the **first live ENS write session** once Egor is present with the wrapped-owner wallet.

This is a narrow execution/product boundary note.
It does **not** reopen the trust-hardening semantics that were just closed.

## Current truth
At note time:
- the first live ÆNS publication path is still execution-blocked on Egor + wrapped-owner wallet approvals
- the runbook/proof-template/public-surface prep is already ready
- publisher-assist v1 now exists, is read-only, evidence-derived, and trust-hardened
- publisher-assist v1 is **not** a session manager and **not** a wizard

So the useful question is not:
- should publisher-assist replace the runbook?

The useful question is:
- how should publisher-assist be used during the first real session so it sharpens execution instead of adding ceremony?

## Core decision
### For the first live ENS write session, `bun run publish-assist` should be used as a **re-runnable pre-write state gate**, not as the main script of the session.

That means:
- use the existing runbook for the overall phase structure
- use `publish-assist` before each human-approved write phase to confirm the current legal next step
- use `inspect` / `capture-proof` after each write phase as the primary verification/capture tools

So publisher-assist is the state-check layer between phases, not the entire session controller.

## Exact operational role by phase

### 1) Session start — confirm the first legal write
At the beginning of the live session:
```bash
bun run check-public-surface
bun run publish-assist
```

Expected happy-path state:
- `preflight-ready`

Meaning:
- current public truth supports the preferred-mode story
- the first legal write is the root resolver/root-record step
- human review is still required before approving the wallet prompt

### 2) After root write verification — confirm child phase is now legal
After the root resolver/root-record write lands:
```bash
bun run inspect pvtclawn.eth
bun run capture-proof -- post-root
bun run publish-assist
```

Expected happy-path state:
- `root-verified`

Meaning:
- root publish state is coherent enough
- the next legal move is child creation / child record writes

### 3) After child write verification — confirm parent authorization is now the legal next move
After child creation and child record writes land:
```bash
bun run inspect research.pvtclawn.eth
bun run publish-assist
```

Expected happy-path state:
- `child-verified-provisional`
  or, depending on observed parent state,
- `needs-parent-authorization`

Meaning:
- the child is coherent enough to proceed
- but success has **not** happened yet
- the next legal move is parent capability authorization

### 4) After parent authorization — confirm final proof capture is now the legal move
After the parent capability-list write lands:
```bash
bun run inspect pvtclawn.eth
bun run inspect research.pvtclawn.eth
bun run publish-assist
```

Expected happy-path state:
- `parent-authorized-verified`

Meaning:
- the authority path is now truly complete
- the remaining legal move is final proof capture, not another ENS write

### 5) After final proof capture — optional terminal confirmation
After the final proof is captured:
```bash
bun run check-public-surface
bun run capture-proof -- final
bun run publish-assist
```

Expected happy-path state:
- `proof-captured`

Meaning:
- current authority is complete
- a strong final-proof artifact now exists

## What publisher-assist should **not** do in the first live session
It should **not** be treated as:
- a replacement for the operator steps
- a replacement for `bun run inspect ...`
- a replacement for `bun run capture-proof -- ...`
- a reason to skip human review of wallet prompts
- a single session object that “knows where we are” without fresh reads

In other words:
- runbook = phase structure
- publish-assist = next-legal-step gate
- inspect/capture-proof = verification/capture evidence
- Egor/wallet = real write authority

## Why this is the right role for v1
This role matches what the current tool actually is:
- read-only
- stateless
- evidence-derived
- good at classifying current publish state
- not responsible for signing or session orchestration

So it sharpens the first live session without over-claiming product maturity.

## Practical implication
For the first real session, the best use of publisher-assist is:
- **before each write phase**
- and optionally **after final capture**

Not continuously, and not instead of the verified read/proof commands already in the runbook.

## Bottom line
Publisher-assist v1 should enter the first live ENS session as a **re-runnable pre-write gate**.
It should confirm the current legal next step between phases, while the runbook, `inspect`, `capture-proof`, and Egor’s wallet approvals remain the real execution spine.

## Core delta
None.
This note does not change the parent/child authorization model.

## Rail delta
Moderate.
This sharpens the practical use of publisher-assist v1 in the first real session.

## Counterfactual relevance test
Would this note still mostly make sense without the `child capability under parent identity` model?

Yes.
So this is supporting execution/product research, not protocol-center progress.
