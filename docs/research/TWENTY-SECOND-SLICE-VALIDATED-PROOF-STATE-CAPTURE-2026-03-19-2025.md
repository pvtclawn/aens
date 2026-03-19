# Twenty-second ÆNS slice — validated proof-state capture (2026-03-19 20:25 UTC)

## Purpose
Make proof artifacts harder to misuse by turning publication state into something the tooling can validate and embed directly.

Before this slice, proof capture had three soft spots:
- `publication mode` and `service URL` could contradict each other
- proof artifacts did not embed the live public-truth snapshot that justified the chosen mode
- bootstrap-mode artifacts recorded only the mutable public fallback URL, not a tighter pinned reference

## Changes made

### 1) Added a shared public-proof-state layer
Added:
- `src/public-proof-state.ts`
- `src/public-proof-state.test.ts`

This layer now handles:
- checking preferred root / preferred child / fallback surfaces
- computing `preferredSurfaceReady`
- computing `bootstrapProofReady`
- producing reusable human-readable snapshot lines

This is now shared logic instead of verifier-only ad hoc output.

### 2) Hardened proof-capture config validation
Updated `src/proof-capture.ts` so proof capture now:
- distinguishes `publicationModeSource` (`explicit` vs `defaulted`)
- classifies the selected service URL into a supported family
- rejects contradictory `publication mode ↔ service URL` pairs
- records `serviceUrlFamily`
- derives a commit-pinned bootstrap source reference when running in bootstrap mode

Concretely, this now fails closed for contradictions like:
- `preferred` mode + GitHub bootstrap blob URL
- `bootstrap` mode + preferred Vercel child URL

### 3) Embedded public-truth snapshot directly into proof artifacts
Updated `src/capture-proof.ts` so each captured artifact now includes a `Public truth snapshot` section generated at capture time.

That snapshot includes:
- preferred public base
- preferred root status
- preferred child-route status
- fallback status
- `Preferred public surface ready`
- `Bootstrap proof ready`

This means the artifact now carries the live external state that justified the chosen publication mode instead of depending on a separate note.

### 4) Tightened bootstrap evidence pinning
Bootstrap-mode artifacts now record both:
- the public/operator-facing fallback URL
- a commit-pinned bootstrap source reference based on the current repo commit

That improves reproducibility even when the public fallback URL still points at a mutable `blob/main/...` surface.

### 5) Updated the verifier to print the two-state publication verdict explicitly
`bun run check-public-surface` now reuses the shared public-proof-state logic and prints both:
- `Preferred public surface ready`
- `Bootstrap proof ready`

So the publication-state split is now visible directly from the verifier, not just from docs/research notes.

## Verification
Ran:
```bash
bun test
bunx tsc --noEmit
AENS_PROOF_DIR=/tmp/aens-proof-validated-state \
AENS_PROOF_PUBLICATION_MODE=bootstrap \
AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md \
  bun run capture-proof -- validated-state
AENS_PROOF_PUBLICATION_MODE=preferred \
AENS_PROOF_SERVICE_URL=https://github.com/pvtclawn/aens/blob/main/docs/public/research-capability-stub.md \
  bun run capture-proof -- should-fail
bun run check-public-surface
```

Observed:
- tests: pass
- typecheck: pass
- valid bootstrap dry-run writes an artifact successfully
- contradictory preferred+bootstrap URL input now fails closed with a config error
- captured artifact header now includes:
  - `Publication mode`
  - `Publication mode source`
  - `Service URL`
  - `Service URL family`
  - `Repo commit`
  - `Pinned bootstrap source`
- captured artifact now includes a `Public truth snapshot` section with current preferred/fallback readiness lines
- verifier now prints:
  - `Preferred public surface ready: no`
  - `Bootstrap proof ready: yes`

## Current live-state consequence
The live truth remains the same:
- preferred Vercel root: `ok`
- preferred Vercel child route: `404`
- GitHub bootstrap fallback: `ok`

So the current honest state is still:
- `preferred surface ready = no`
- `bootstrap proof ready = yes`

## Verdict
This slice makes proof artifacts materially more self-justifying.

The tooling still does not solve the Vercel deployment issue itself.
But it now makes it much harder to produce a clean-looking artifact that hides why bootstrap mode was used or whether the chosen publication state was internally coherent.

## Next step
Use Lane C to verify the new validated proof-state capture end to end and confirm the artifact/verifier wording remains aligned with the current live state.
