# Twenty-first ÆNS slice — bootstrap proof artifact capture (2026-03-19 20:06 UTC)

## Purpose
Make the first live proof artifact honest even if the final service target must use bootstrap fallback mode.

The prior proof-capture flow already saved CLI snapshots, but it did **not** record the crucial publication context that now matters for the first live proof:
- whether the session is using the **preferred** child route or **bootstrap** fallback mode
- the exact `aens.service` URL selected for publication
- the git commit hash for the referenced surface/content

Without that metadata, a fallback publication could later be misread as preferred-route success.

## Changes made

### 1) Replaced shell-heavy proof capture logic with typed TS capture logic
Added:
- `src/proof-capture.ts`
- `src/capture-proof.ts`
- `src/proof-capture.test.ts`

The new typed capture layer now:
- resolves publication mode (`preferred` or `bootstrap`)
- resolves the exact service URL for the chosen mode
- validates explicit service-URL overrides
- builds the proof artifact header in one place
- keeps command-section rendering structured and testable

The legacy shell entrypoint `scripts/capture-live-proof.sh` is now only a thin wrapper around the TS implementation.

### 2) Proof artifacts now record the required publication metadata
Captured markdown artifacts now include:
- capture timestamp
- **publication mode**
- **service URL**
- **repo commit hash**
- working directory

Default mode is intentionally conservative:
- if no explicit mode is provided, capture defaults to `bootstrap`

Default service URLs are mode-specific:
- `preferred` → `https://aens-nine.vercel.app/research-capability/`
- `bootstrap` → `https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md`

Env overrides remain available:
- `AENS_PROOF_DIR`
- `AENS_PROOF_PUBLICATION_MODE`
- `AENS_PROOF_SERVICE_URL`

### 3) Operator docs now align with publication mode
Updated current operator docs so the live session starts by choosing exactly one mode:
- `preferred` only if `bun run check-public-surface` says the preferred route is truly ready
- `bootstrap` only if the capability-scoped fallback remains acceptable under the already-frozen fallback rule

Updated docs:
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`

Those docs now tell the operator to export:
- `AENS_PROOF_PUBLICATION_MODE`
- `AENS_PROOF_SERVICE_URL`

before baseline capture and before setting `aens.service` on the child.

## Verification
Ran:
```bash
bun test
bunx tsc --noEmit
AENS_PROOF_DIR=/tmp/aens-proof-capture-test \
AENS_PROOF_PUBLICATION_MODE=bootstrap \
  bun run capture-proof -- verify
```

Observed:
- tests: pass
- typecheck: pass
- dry-run proof artifact written successfully
- artifact header now includes:
  - `Publication mode: bootstrap`
  - exact bootstrap fallback URL
  - current git commit hash

The dry-run still exits non-zero because the live ENS names are not yet populated, which is expected and honest for pre-publication capture.

## Verdict
This slice closes the main artifact-integrity gap in the fallback path.

The proof-capture flow now records enough metadata that a bootstrap-mode live proof can stay auditably narrow instead of being mistaken later for preferred-route success.

## Next step
Use Lane C to verify the new capture flow against the current live-surface truth and the chosen publication-state model:
- rerun `bun run check-public-surface`
- rerun mode-aware proof capture
- verify the artifact language stays consistent with `preferred surface ready` vs `bootstrap proof ready`
