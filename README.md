# ÆNS

ÆNS is a deliberately narrow ENS utility with **two real surfaces**:

- **ENS Root Explorer** — inspect a root ENS name and its current `aens.*` records
- **Write Records** — prepare and submit `aens.capabilities`, `aens.parent`, and `aens.service` writes from a wallet

Live app:
- Root explorer: `https://aens-nine.vercel.app/`
- Write records: `https://aens-nine.vercel.app/write-records/`

Legacy research/discovery routes were a bad idea and are being retired from the product surface.

## What ÆNS does now

### 1) Root Explorer
The root explorer resolves an ENS name in-browser and shows the current:
- address
- `aens.parent`
- `aens.service`
- `aens.capabilities`

The goal is simple: show current ENS truth before any write happens.

### 2) Write Records
The write flow prepares the exact text-record writes for:
- `aens.capabilities`
- `aens.parent`
- `aens.service`

It keeps the wallet boundary explicit. You can inspect the payload before signing anything.

## Honest claim
ÆNS currently proves that:
- ENS root state can be inspected cleanly in-browser
- the write flow can prepare the exact `aens.*` text-record writes needed for a capability subname
- the product can stay narrow and honest instead of pretending to be a bigger endpoint/discovery platform

ÆNS does **not** currently prove:
- automatic wallet execution
- runtime auth
- payments
- full production hardening

## Local development

Install dependencies:

```bash
bun install
cd app && bun install
```

### Run the CLI inspector
```bash
bun run inspect vitalik.eth
```

### Run the web app locally
```bash
cd app
bun run dev
```

### Build the app
```bash
cd app
bun run build
```

### Typecheck
```bash
bun run typecheck
```

### Public surface check
```bash
bun run check-public-surface
```

## Repo structure
- `app/` — Vite/React UI for the live explorer + write flow
- `src/resolver.ts` — ENS resolution + text-record reads
- `src/profile.ts` — normalized ÆNS profile model
- `src/capability-authorization.ts` — capability relationship logic
- `src/public-surface.ts` — public-surface verification helpers
- `docs/submission/` — current Synthesis submission pack
- `docs/research/` — timestamped working notes and verification receipts

## Submission docs
Current submission-facing docs live in:
- `SYNTHESIS.md`
- `docs/submission/SYNTHESIS-SUBMISSION-FORM-PACK-2026-03-21.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md`
- `docs/submission/SYNTHESIS-SUBMISSION-BLURB-2026-03-20.md`
- `docs/submission/SYNTHESIS-TRACK-FIT-2026-03-21.md`

## Product truth, one line

**ÆNS is the minimal ENS utility for inspecting root identity state and writing the `aens.*` records that matter.**
