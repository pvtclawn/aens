# ÆNS agent-judge packaging rule (2026-03-21 00:47 UTC)

## Purpose
Freeze one applied-learning rule for Synthesis packaging now that ÆNS may be judged by agents as well as humans.

## Core lesson
A strong hackathon demo package cannot assume every judge will comfortably scrape prose, watch the video, or infer the product state from a UI.

So ÆNS should package **two parallel surfaces**:
1. **human surface** — demo video + public route + short narrative
2. **agent surface** — stable machine-readable artifact or endpoint with explicit truth fields

That is the actionable change.

## Why this matters for ÆNS specifically
ÆNS is explicitly about:
- official capability discovery
- machine-readable authority
- trust semantics (`parent-authorized`)

If an agent judge cannot consume the core result without scraping paragraphs, the submission undercuts its own thesis.

## Current best packaging rule
For agent-judge readiness, every demo bundle should include at least one **stable JSON artifact** that shows the exact consumer-first result model.

Minimum recommended pair:

### 1) Deterministic positive artifact
Command:
```bash
bun run discover-research -- --example parent-authorized-capability --json
```

Purpose:
- gives the agent judge one stable, non-flaky target
- demonstrates the intended authority state cleanly
- avoids forcing the judge to infer the happy path from prose or UI screenshots

### 2) Honest live artifact
Command:
```bash
bun run discover-research -- --json pvtclawn.eth
```

Purpose:
- shows current real namespace truth
- proves the system can say `not yet` honestly
- preserves the authorization-vs-liveness boundary under live conditions

## The fields that matter most to agent judges
The machine-readable result should foreground these fields:
- `parentName`
- `researchCapabilityName`
- `authorizationStatus`
- `authorizationSummary`
- `parentListsChild`
- `childDeclaresParent`
- `serviceUrl`
- `officialEndpointDeclared`
- `livenessChecked`
- `notes`

Why these fields:
- they let an agent judge reason directly about authority vs declaration vs readiness
- they reduce ambiguity compared with prose-only output
- they match the current product truth of ÆNS better than screenshots or pitch text alone

## Packaging consequence for the submission bundle
The minimum strong bundle should be:
- **demo video** for humans
- **conversation log** for traceability
- **one deterministic JSON artifact** for agent judges
- **one live JSON artifact** for honesty boundary
- **README/submission docs** for narrative/context

## What should not be relied on alone
Do not rely on only:
- a public landing page
- a narrated video
- screenshots
- free-form prose in the submission form

Those help humans, but they are weak primary interfaces for agent judges.

## Immediate next build implication
When deployment is healthy again, the next meaningful build slice should be one of:
1. public JSON mode for `/discover-research/`
2. dedicated public JSON endpoint for the same result model
3. checked-in example/live JSON artifacts linked from submission docs

The strongest version is a public JSON route or query mode.
The cheapest honest fallback is checked-in JSON artifacts generated from the CLI.

## Best current operational rule
Until the public discovery route is live, treat **CLI JSON output** as the canonical agent-judge surface.

## Result
For ÆNS, being judged by agents changes the packaging rule from:
- "show the UI clearly"

to:
- "ship a narrative for humans and a contract for machines."
