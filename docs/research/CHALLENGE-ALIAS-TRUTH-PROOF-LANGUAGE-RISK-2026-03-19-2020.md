# Challenge — alias-truth proof language risk (2026-03-19 20:20 UTC)

## Purpose
Red-team the new trust rule:

> for ÆNS public service surfaces, the production alias is the primary public truth

The question now is not whether that rule is conceptually right.
It is whether the current proof tooling makes it **hard to violate in practice**.

## Verdict
### The rule is correct, but the tooling is still soft around it.

Recent work sharply improved the model:
- preferred route readiness is now distinct from bootstrap proof readiness
- proof capture records publication mode, service URL, and commit hash
- the stale Vercel alias boundary is explicitly documented

But the current operator path can still produce a proof artifact that is structured while remaining:
- internally inconsistent
- insufficiently pinned
- or too weakly tied to the live public-truth snapshot

That means the remaining risk is no longer blunt overclaim.
It is **clean-looking ambiguity**.

## Weakness 1 — mode and service URL can still contradict each other
Current proof capture accepts publication mode and service URL as separate operator inputs.
There is no strong coupling that prevents states like:
- `preferred` mode + bootstrap blob URL
- `bootstrap` mode + preferred Vercel URL

### Why this matters
A proof artifact could look formally complete while encoding a contradictory publication claim.
That would undercut the whole recent publication-state split.

### Mitigation
- validate mode and service URL together during proof-capture config resolution
- either reject mismatches outright or require an explicit danger override with a warning block in the artifact
- keep the common mode-specific defaults, but stop treating arbitrary overrides as equally trustworthy

## Weakness 2 — proof artifacts do not yet include the public-truth snapshot that justified the chosen mode
The current artifact header records:
- publication mode
- service URL
- repo commit hash

But it does **not** include the current live public-surface state that makes that mode honest.

Example missing evidence:
- preferred root status
- preferred child-route status
- fallback status
- resulting readiness verdict at capture time

### Why this matters
The alias-truth rule says public truth wins.
But the proof artifact still depends on a separate verifier run or a separate note to explain the actual public truth observed at the moment of capture.

That leaves room for detached artifacts that travel further than the note that made them honest.

### Mitigation
- add a `Public truth snapshot` section to each proof artifact
- embed the latest preferred/fallback status lines directly
- include the exact readiness verdict used at capture time
- ideally include HTTP metadata or content digest for the referenced service URL

## Weakness 3 — the bootstrap fallback remains branch-mutable unless pinned more tightly
The current bootstrap URL is a `blob/main/...` page.
The artifact records the commit hash separately, which helps, but the clickable service URL itself still tracks branch tip behavior.

### Why this matters
Later readers may click the recorded fallback URL and see different content from what existed when the proof was captured.
That weakens reproducibility and can blur what exactly the first proof referenced.

### Mitigation
- record both:
  - the public/operator-facing fallback URL
  - a commit-pinned source URL or source digest
- optionally store a content hash of the fetched fallback page inside the artifact
- treat branch URLs as usability affordances, not as the sole reproducibility anchor

## Weakness 4 — silent bootstrap default can make omission look intentional
Current capture defaults to `bootstrap` when no publication mode is explicitly supplied.
That is conservative compared with defaulting to preferred.
But it still hides whether the operator intentionally chose a mode.

### Why this matters
For the first live proof, publication mode is itself part of the trust claim.
A silent default allows “forgot to choose” to look too much like “deliberately chose bootstrap.”

### Mitigation
- require explicit mode in live-session use
- or record `mode source: explicit|defaulted`
- or fail closed outside test/dry-run contexts when no explicit mode is provided

## Weakness 5 — machine output still does not encode the full two-state verdict cleanly
The current verifier prints whether the preferred surface is ready and whether the fallback is reachable.
But the stronger operational conclusion — `bootstrap proof ready` — still lives in notes and interpretation.

### Why this matters
This means the trust model is currently split across:
- verifier output
- docs/research notes
- operator judgment
- proof artifact header

That is much better than before, but still not a single crisp machine-checked state bundle.

### Mitigation
- extend the verifier to print both:
  - `preferred surface ready`
  - `bootstrap proof ready`
- keep the criteria explicit and separate
- let `capture-proof` import or embed those statuses directly

## Bottom line
The recent slices fixed the big conceptual confusion.
What remains is the subtler operational version:

> a proof artifact can still look neat while underspecifying why its publication mode was honest.

## Best next move
The next hardening slice should be a small ops/build slice:

### Validated proof-state capture
It should do exactly three things:
1. validate publication mode ↔ service URL consistency
2. embed a live public-truth snapshot in the proof artifact
3. record a pinned fallback reference (or content digest) alongside any mutable public URL

If that lands, ÆNS will be much harder to fool — not just conceptually, but in the actual artifacts a human sees.
