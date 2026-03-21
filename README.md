# ÆNS

ÆNS helps people and software discover the **official research endpoint** for an ENS identity.

A parent ENS name authorizes a child research capability like `research.pvtclawn.eth`, so a client can verify which research endpoint is officially endorsed by `pvtclawn.eth`.

**MVP v1 loop:** input `pvtclawn.eth` -> discover `research.pvtclawn.eth` -> verify `parent-authorized` -> return/open the official research endpoint.

**MVP v1 schema:** capability type = `research`, child capability name, service URL, parent identity reference, authorization status.

**Current proof status:** ÆNS currently demonstrates the research-capability authority model through a consumer-first CLI and a deterministic positive-path example, and it verifies the preferred public research page separately. It does **not** yet prove that `pvtclawn.eth` is already live end-to-end as a parent-authorized research capability, and it does **not** prove endpoint liveness unless that is checked separately.

## Synthesis snapshot

ÆNS makes `<capability>.<agent>.eth` load-bearing.

The core model is simple:
- `pvtclawn.eth` = identity anchor
- `research.pvtclawn.eth` = child capability
- `parent-authorized` = the key trust milestone

This repo is building toward ENS-native **child capability authority**, not just generic discovery or endpoint metadata.

Submission-facing docs:
- `docs/submission/SYNTHESIS-COMPETITIVE-POSITIONING-2026-03-21.md`
- `docs/submission/SYNTHESIS-TRACK-FIT-2026-03-21.md`
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-SUBMISSION-BLURB-2026-03-20.md`

**ÆNS is an ENS-native CLI trust debugger for agent profiles and capability subnames.**

Today, ÆNS is not yet a full invocation/payment protocol.
Its current product truth is simpler: given an ENS name, it resolves the name, reads relevant ENS records, classifies capability authority, optionally fetches linked proof material, and prints a trust-tier report that makes the result legible.

## What it does today

ÆNS currently supports:
- consumer-first research capability discovery via `bun run discover-research -- <parent-ens-name>`
- deterministic positive-path consumer demo via `bun run discover-research -- --example parent-authorized-capability`
- public web discovery route at `https://aens-nine.vercel.app/discover-research/`
- live ENS lookup via `bun run inspect <ens-name>`
- capability-authority classification for ENS child capability surfaces
- optional linked proof/receipt fetching via `--with-links`
- trust-tier report rendering with explicit sections for:
  - identity anchor
  - capability authority
  - linked proof material
  - live observations
  - inferred claims / caveats
- deterministic offline example scenarios for contrasting authority states

In plain English: ÆNS helps answer questions like:
- “Is this ENS name just a profile, or does it look like a callable agent/service surface?”
- “If this is a child capability subname, is it actually authorized by the parent?”
- “Does the name declare proof/receipt links, and what do those links appear to contain?”

## ENS records ÆNS reads today

### Standard ENS/profile records
- `description`
- `url`
- `avatar`
- `com.twitter`
- `com.github`
- `org.telegram`

### Current ÆNS-specific records
- `aens.agentId`
- `aens.service`
- `aens.proofs`
- `aens.receipts`
- `aens.runtime`
- `aens.parent`
- `aens.capabilities`

These are read-only today.
ÆNS currently does **not** publish or modify ENS records.

## Quickstart

```bash
bun install
```

### 1) Consumer-first research discovery
Live current namespace check:
```bash
bun run discover-research -- pvtclawn.eth
```

Deterministic positive-path consumer demo:
```bash
bun run discover-research -- --example parent-authorized-capability
```

This is the narrow MVP loop:
input parent ENS name -> derive the `research.<parent>` capability -> verify authorization -> return the official endpoint if one is declared.

Today, the second command is the cleanest way to demonstrate the exact target state without pretending the live `pvtclawn.eth` publication is already finished.

### 2) Live ordinary ENS lookup
```bash
bun run inspect vitalik.eth
```

Optional linked-proof fetch pass:
```bash
bun run inspect vitalik.eth --with-links
```

### 3) Deterministic authority examples
```bash
bun run inspect --example parent-authorized-capability
bun run inspect --example unlisted-child-capability
bun run inspect --example identity-mismatch-capability
```

These examples are offline and deterministic.
They exist so the authority model is visible from the CLI without waiting on live ENS publication.

### 4) Service endpoint (agent-friendly)
```bash
curl "https://aens-nine.vercel.app/api/discover-research?name=pvtclawn.eth"
```

Response contract is stable under `source: "aens-discover-research-v1"` and includes:
- authorization status + summary,
- endpoint fields (`capabilityName`, `serviceUrl`, `officialEndpointDeclared`),
- notes,
- resolve timestamp.

## How to interpret capability-authority states

### `parent-authorized`
The child capability subname:
- declares a parent
- matches that parent identity
- and is explicitly listed by the parent profile

Example meaning:
> this looks like an officially authorized capability surface of the parent ENS identity.

### `unlisted-child`
The child capability subname:
- matches the parent identity
- but is **not** listed by the parent profile

Example meaning:
> this may be related to the same agent identity, but the parent has not explicitly authorized it as an official capability surface.

### `identity-mismatch`
The child capability subname has a broken authority relationship, for example:
- the parent relationship is inconsistent
- or the child agent identity does not match the parent identity

Example meaning:
> this should not be treated as an authorized capability surface.

### `not-a-capability-surface`
The ENS name does not currently look like a declared parent/child capability surface.

Example meaning:
> this is an ordinary ENS identity/profile path, not an authorized child capability.

## What is implemented now

- ENS name resolution via `viem`
- ENS text-record ingestion + normalization
- capability-authority classification
- linked proof/receipt fetch + lightweight structure summary
- trust-tier report rendering
- deterministic example/demo registry for contrasting authority outcomes
- tests for resolver/config, authority classification, proof summaries, reports, and example coverage

## What is **not** implemented yet

- writing/publishing ENS records
- live public positive example publication
- invocation or payment flow
- x402 / ERC-8128 execution path
- onchain proof writes or attestation flow
- polished end-user app/UI beyond the CLI report

## Minimal architecture

- `src/resolver.ts` — ENS resolution + text record reads
- `src/profile.ts` — normalized ÆNS profile model
- `src/capability-authorization.ts` — authority classification for child capability names
- `src/linked-records.ts` — linked proof/receipt fetch + lightweight structure summaries
- `src/report.ts` — trust-tier report rendering
- `src/examples.ts` — deterministic CLI demo scenarios
- `src/cli.ts` — command entrypoint

## Why the repo looks the way it does

ÆNS is being built as a sequence of small, evidence-backed slices.
The research notes in `docs/research/` are there to freeze product decisions and verification passes, but the intended first-touch surface is now this README plus the CLI commands above.

## Current product truth, one more time

ÆNS currently proves:
- ENS can be a load-bearing entrypoint for agent identity and capability authority inspection
- child capability subnames can be classified in a legible way
- declared proof material can be kept distinct from live observations and inferred claims

ÆNS does **not yet** prove:
- live invocation
- payment flows
- broad public deployment
- a finished protocol surface

That boundary is intentional.
 protocol surface

That boundary is intentional.
