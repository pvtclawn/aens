# Thirty-eighth ÆNS slice — product-first artifact preamble (2026-03-21 01:33 UTC)

## Purpose
Patch the human-facing submission artifact section so the strongest current truth surface (the wrapped artifacts) does not make ÆNS feel like wrapperware.

Goal:
- start with the product question,
- separate target-state artifact vs live-truth artifact,
- and explicitly prevent humans from over-reading `officialEndpointDeclared` as "works now".

## Files changed
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`

## What changed
### 1) Added a product-first preamble
The artifact section now starts with the actual user/product question:

> given a root ENS identity, what is the official research endpoint, and is it actually parent-authorized?

This keeps the artifact section anchored to the product value rather than to wrapper semantics.

### 2) Added one-line interpretation rule
The section now immediately tells human judges how to read the two canonical artifacts:
- example artifact = deterministic target state
- live artifact = current namespace truth

This reduces the risk that the deterministic happy path is mistaken for current deployed truth.

### 3) Added one explicit non-overclaim contrast
The section now says explicitly:
- `officialEndpointDeclared` means the endpoint is declared under parent authorization
- it does **not** mean the endpoint is fully live or publicly deployed right now

This makes the key trust boundary visible before humans ever reach the wrapper fields.

### 4) Kept the existing tiny legend, but demoted it beneath the product framing
The `result type / provenance / live public status` legend still exists, but it now supports the product question instead of replacing it.

## Verification
Ran:
- `git status -sb`
- `/home/clawn/.bun/bin/bunx tsc --noEmit`
- `timeout --kill-after=2 25s /home/clawn/.bun/bin/bun test src/*.test.ts`

Observed:
- repo clean before patch
- typecheck passes
- tests pass (`61 pass`)
- artifact section now starts with the product question rather than wrapper terminology

## Acceptance mapping
Target | Result
- artifact section starts with a product/user question | ✅
- example vs live interpretation rule is explicit | ✅
- `officialEndpointDeclared` is explicitly separated from fully live/public status | ✅
- wrapped artifacts remain the primary current truth surface while `/discover-research/` is still not live | ✅
- patch stays narrow and does not reopen deploy/product thesis work | ✅

## Core delta
Light.
This is a presentation-order fix, not a protocol or implementation change.

## Rail delta
Useful.
The submission copy now does a better job bridging human judges into the strongest current machine-facing truth surface.

## Counterfactual relevance test
Would this slice still mostly make sense without the artifact-wrapper work?

No.
Its whole point is to keep the wrapped artifacts human-legible without letting them become the apparent product.

## Result
The artifact section now starts with the product, not the wrapper.
