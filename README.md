# ÆNS

ÆNS solves a narrow operator problem:

How do you safely move from “what is currently published under this ENS root?”
to “what exact `aens.*` records should I write next?”

Most ENS demos jump straight to writing or overclaim broad “agent platform” scope.
ÆNS keeps this explicit and auditable.

ÆNS has two production surfaces:
- ENS Root Explorer — read current root truth (`address`, `aens.parent`, `aens.service`, `aens.capabilities`)
- Write Records — prepare and submit deterministic `aens.capabilities`, `aens.parent`, and `aens.service` writes

Live app:
- Root explorer: https://aens-nine.vercel.app/
- Write records: https://aens-nine.vercel.app/write-records/

## Problem

Operators and agent builders need a reliable flow for ENS capability publication:
1) inspect current root state,
2) derive the exact record changes,
3) preserve a clear wallet approval boundary.

Without this, teams either:
- write records blindly,
- hide writes behind opaque automation,
- or confuse identity/read state with write intent.

## Solution

ÆNS enforces a two-step workflow:

1) Inspect first
- resolve a root ENS name in-browser,
- read current `aens.*` records directly from chain-backed reads,
- expose missing/empty state clearly.

2) Prepare deterministic writes
- build a concrete planned-write set for `aens.capabilities`, `aens.parent`, `aens.service`,
- preview payload before signature,
- execute only after explicit wallet approval.

## What ÆNS proves today

- Root ENS state can be inspected clearly in-browser.
- Write payloads are deterministic and visible before signing.
- The product scope stays intentionally narrow and testable.

## What ÆNS does not claim

- automatic wallet execution without approval,
- runtime auth/payment protocols,
- generalized agent infrastructure completeness.

## Local development

Install dependencies:

```bash
bun install
cd app && bun install
```

Run CLI inspector:

```bash
bun run inspect vitalik.eth
```

Run web app locally:

```bash
cd app
bun run dev
```

Build web app:

```bash
cd app
bun run build
```

Typecheck:

```bash
bun run typecheck
```

Public-surface verification:

```bash
bun run check-public-surface
```

## Repo structure

- app/ — Vite/React UI (Root Explorer + Write Records)
- src/resolver.ts — ENS resolution and text-record reads
- src/public-route-capabilities.ts — deterministic capability/write planning
- src/public-surface.ts — live surface verification
- docs/submission/ — Synthesis submission pack
- docs/research/ — timestamped engineering notes and receipts

## Submission docs

- SYNTHESIS.md
- docs/submission/SYNTHESIS-DEVFOLIO-FIELD-MAP-2026-03-22.md
- docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md
- docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md
- docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-22.md
- docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md

## One-line product truth

ÆNS is a focused ENS operator utility: inspect root truth, prepare exact `aens.*` writes, keep approval explicit.
