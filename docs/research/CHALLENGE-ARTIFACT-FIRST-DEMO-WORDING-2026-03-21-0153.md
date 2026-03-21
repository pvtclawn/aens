# Challenge — artifact-first demo wording can still feel too indirect for humans (2026-03-21 01:53 UTC)

## Purpose
Red-team the new artifact-first demo wording before the two-doc consistency patch lands.

The wording note is directionally strong:
- do not apologize for the undeployed route
- upgrade the strongest verified surface instead
- treat wrapped artifacts as the current primary truth surface

The question here is:

> **what could still make this demo ordering feel weak or indirect to human judges?**

## Main critique
The biggest remaining risk is not the phrase `production catches up`.
The bigger risk is **sequencing**.

If the demo begins with:
1. wrapped example artifact
2. wrapped live artifact
3. CLI backup
4. live research-capability page

then a human judge can still spend too long inside proof surfaces before seeing anything that feels like a public product surface.

That can make ÆNS feel like:
- a very careful evidence bundle,
- plus some supporting interfaces,
- rather than a capability-discovery product with evidence attached.

## Why this matters
Human judges do not only score correctness.
They also score whether the thing feels like a product worth caring about.

If the first three steps are all artifacts/CLI, the submission can still feel:
- indirect
- overly internal
- proof-heavy before value is felt

This is especially dangerous because the public discovery route is still not live, so the demo already lacks the cleanest intended product surface.

## Strongest failure mode
The worst outcome is:
- the submission successfully proves that the team is honest and careful,
- but fails to create a fast intuitive sense that ÆNS is a real ENS-native capability-discovery product.

In other words:
- **truth wins**
- **product feeling loses**

That is a real hackathon risk.

## Mitigation
Keep **artifact-first truth**, but insert the currently live public research capability page earlier as the first human-facing visual/public anchor.

### Better ordering for human judges
1. wrapped example artifact — clearest current proof of target discovery flow
2. **live research-capability page** — immediate public/visual anchor
3. wrapped live artifact — current namespace truth boundary
4. CLI — reproducibility backup
5. `/discover-research/` route — intended deployed surface, with explicit deployment caveat

## Why this is better
### Step 1 still keeps truth first
The wrapped example artifact remains the strongest current proof surface.
So the submission still does not overclaim live deployment.

### Step 2 restores product feeling quickly
Opening the live research-capability page right after the example artifact gives human judges a public surface to latch onto early.

That means the demo no longer feels like:
- JSON
- more JSON
- shell
- finally a page

Instead it feels like:
- proof of target state
- real public surface
- honest live-state boundary
- reproducibility backup

That is much healthier.

### Step 3 keeps honesty
The wrapped live artifact still shows the real namespace truth.
So the live/public gap remains explicit.

### Step 4 keeps CLI in the right role
CLI remains important, but as evidence/reproducibility backup rather than a primary human-facing step.

## What this changes
This critique should change the pending two-doc patch.

Do **not** make the demo ordering:
- example artifact
- live artifact
- CLI
- live page

Prefer:
- example artifact
- live research-capability page
- live artifact
- CLI
- intended discovery route with caveat

## Strongest sentence
**Artifact-first is right for truth, but not every human-facing step after that should also be a proof surface.**

## Best wording implication
When the next docs patch lands, the live research-capability page should be described as:
- the current public supporting surface
- the first human-facing visual anchor after the example artifact

not as a late appendix after multiple proof layers.

## Verdict
The artifact-first wording is good, but incomplete.
Without bringing the live research-capability page earlier in the order, the demo can still feel more like evidence choreography than a product demo.
