# Plan — product-first artifact preamble for ÆNS submission docs (2026-03-21 01:28 UTC)

## Why this plan exists
The latest challenge note found a real presentation risk:

- the wrapped artifacts are the strongest current submission truth,
- but explaining them the wrong way can make ÆNS feel like wrapper/plumbing theater instead of a capability-discovery product.

So the next slice should not add more field explanation.
It should add the smallest possible **product-first preamble** ahead of the artifact section.

## Smallest shippable milestone
Patch the submission artifact section so humans encounter this order:
1. **user problem**
2. **artifact interpretation rule**
3. **tiny legend**

This keeps the wrapped artifacts as the primary current truth surface without making the submission feel like it is mainly about JSON packaging.

## Crisp tasks

### Task 1 — add a one-line user-problem preamble
Add one short sentence before the artifact section that frames the actual product question.

Target direction:
> given a root ENS identity, what is the official research endpoint, and is it actually parent-authorized?

Constraint:
- the sentence must sound like a product/user question, not artifact documentation
- keep it short enough to scan in one glance

### Task 2 — add a one-line interpretation rule
Immediately after the user-problem sentence, add one short interpretation rule:
- **example artifact = target state**
- **live artifact = current truth**

Constraint:
- this line must prevent humans from confusing the deterministic happy path with current deployed status
- keep it plain English, not field-by-field jargon

### Task 3 — add one explicit non-overclaim contrast
In the same small section, add one short contrast that prevents over-reading:
- `officialEndpointDeclared` means the endpoint is declared under parent authorization
- it does **not** mean the endpoint is fully live or publicly deployed right now

Constraint:
- this must be stated explicitly, not implied through the legend alone
- do not broaden into a long caveat paragraph

## Primary target docs
Patch only the most important human-facing submission surfaces first:
1. `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
2. `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md` if needed for consistency

Optional only if truly necessary:
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`

## Acceptance criteria
This plan passes only if all of the following are true:

1. The artifact section starts with a **product question**, not wrapper terminology
2. The deterministic artifact and live artifact are clearly separated as:
   - target state
   - current truth
3. The copy explicitly says that `officialEndpointDeclared` is **not** the same as fully live/publicly deployed status
4. The wrapped artifacts remain the primary current submission truth surface while `/discover-research/` is still not live
5. The patch stays narrow:
   - no reopening of track fit
   - no new route/deploy claims
   - no new core product wording overhaul

## Explicit non-goals
Do **not** use this slice to:
- rewrite the full demo script
- reopen product thesis language across the whole repo
- change the wrapper artifact schema
- solve the Vercel deployment lag

This is just a presentation-order patch.

## One clearly defined next task
**Patch the submission form pack with a short product-first preamble, one-line interpretation rule, and one explicit non-overclaim contrast above the wrapped artifact section.**

## Why this is the right next step
It is:
- smaller than another broad submission rewrite,
- directly motivated by the latest challenge note,
- useful to human judges immediately,
- and compatible with the current truth that artifacts are primary while the public route is still not live.
