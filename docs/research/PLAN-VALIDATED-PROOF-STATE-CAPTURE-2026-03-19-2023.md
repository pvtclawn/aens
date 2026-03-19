# Plan — validated proof-state capture (2026-03-19 20:23 UTC)

## Purpose
Freeze the next hardening slice so ÆNS proof artifacts become harder to misuse in practice.

Recent work already separated:
- **preferred surface ready**
- **bootstrap proof ready**
- **not ready to publish**

But the latest red-team note showed the remaining weakness clearly:
- proof artifacts can still be structurally tidy while under-encoding *why* the chosen publication mode was honest

This plan does **not** reopen the Vercel deployment debate.
It focuses only on making proof capture encode publication state more rigorously.

## Current weaknesses to address
1. `publication mode` and `service URL` can still contradict each other
2. proof artifacts do not yet embed the live public-truth snapshot that justified the chosen mode
3. bootstrap fallback evidence is not pinned tightly enough inside the artifact itself

## Decision
### The next slice is: **validated proof-state capture**

The slice should add one reusable proof-state model that can be used by both:
- public-surface verification
- proof-capture artifact generation

That model should make the selected publication state explicit and testable, not just implied by operator discipline.

## Exact scope
The next slice should do exactly three things.

### 1) Validate mode ↔ service URL consistency
Proof capture must stop treating `publication mode` and `service URL` as unrelated strings.

#### Minimum rule
- `preferred` mode may only use a preferred child-route service URL
- `bootstrap` mode may only use a capability-scoped bootstrap fallback URL
- contradictory combinations must fail closed

#### Practical interpretation for this repo
- preferred default URL family = `https://aens-nine.vercel.app/research-capability/`
- bootstrap default URL family = GitHub-hosted `research-capability-stub` surface

If an override is allowed, it must still be classified into one of those families explicitly — not accepted as a silent free-form string.

### 2) Embed a public-truth snapshot directly in the proof artifact
Every captured artifact should include the live public-surface state that justified the selected mode.

#### Minimum required snapshot fields
- preferred public base
- preferred root status summary
- preferred child-route status summary
- fallback status summary
- `preferred surface ready` verdict
- `bootstrap proof ready` verdict
- selected publication mode

This section should be generated at capture time, not copied manually into notes later.

### 3) Pin bootstrap evidence more tightly inside the artifact
The artifact must not rely only on a mutable `blob/main/...` URL for reproducibility.

#### Minimum pinning rule
If the selected mode is `bootstrap`, the artifact must record both:
- the public/operator-facing fallback URL
- a commit-pinned source reference derived from the current repo commit

A content digest would also be acceptable, but the smallest useful move is commit-pinned fallback reference capture.

## Chosen implementation shape
Use one small shared state layer instead of duplicating logic in separate commands.

### Step 1 — shared public-state model
Add a reusable helper that evaluates:
- preferred root result
- preferred child result
- fallback result
- preferred-surface verdict
- bootstrap-proof verdict

This should live near the current `public-surface` logic, not inside the CLI wrapper only.

### Step 2 — proof-capture config hardening
Extend proof-capture config resolution so it can:
- classify the selected service URL
- reject mode/url contradictions
- derive a pinned fallback source reference when in bootstrap mode

### Step 3 — artifact rendering hardening
Extend the proof artifact header/body to include:
- publication mode
- service URL
- pinned fallback reference (when applicable)
- public-truth snapshot section

## Explicit non-goals for this slice
Do **not** expand scope into:
- fixing the Vercel deployment itself
- changing the preferred public base
- redesigning the whole live-session runbook
- fully solving custom arbitrary URL classification beyond the current preferred/bootstrap families
- replacing bootstrap mode with a different fallback surface

Those are separate concerns.

## Acceptance criteria
The next slice passes only if all of these are true:

### A. Contradictory mode/url inputs fail closed
Examples that must fail:
- `preferred` mode + GitHub blob fallback URL
- `bootstrap` mode + Vercel preferred child URL

### B. Proof artifacts carry live public-truth state
A captured artifact must include a section that shows:
- current preferred root status
- current preferred child-route status
- current fallback status
- `preferred surface ready`
- `bootstrap proof ready`

### C. Bootstrap artifacts pin evidence more tightly
When in bootstrap mode, a captured artifact must include:
- the public fallback URL used for publication
- a commit-pinned source reference for the fallback content

### D. Local checks still pass
- `bun test`
- `bunx tsc --noEmit`
- a dry-run `capture-proof` in bootstrap mode

## Next Task
### Build validated proof-state capture
Implement one small shared proof-state layer and wire it into `capture-proof` so the generated artifact:
1. rejects contradictory `mode ↔ service URL` combinations
2. embeds the live public-truth snapshot
3. records a commit-pinned bootstrap reference alongside the public fallback URL

## Why this is the right next move
This keeps the trust model load-bearing.
The next problem is not conceptual anymore.
It is operational honesty inside the artifact a human will actually read.
