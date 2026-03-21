# Synthesis submission form pack — ÆNS (2026-03-21)

Use this as the copy-paste pack for the actual submission form, aligned to the Builder Guide.

## Recommended tracks
1. **ENS Open Integration**
2. **ENS Identity**
3. **Synthesis Open Track** — include only if the submission form exposes it as a separately selectable track

Reasoning is frozen in:
- `docs/submission/SYNTHESIS-TRACK-FIT-2026-03-21.md`

## Project name
**ÆNS — Official Capability Discovery for Agents on ENS**

## One-line pitch
ÆNS lets software discover an agent’s official capability endpoints from its ENS root identity.

## Short description
ÆNS is an ENS-native capability discovery system for agents. Instead of treating one ENS name as a generic profile, it treats the root name as identity and child subnames as official capability surfaces. Given a root identity like `pvtclawn.eth`, a client can discover `research.pvtclawn.eth`, verify whether that capability is parent-authorized, and then use or test the endpoint it declares.

## Problem statement
Current agent identity stacks usually answer one of two questions: who an agent is, or where some endpoint lives. They rarely answer the more useful trust question: whether a specific capability endpoint is officially endorsed by that identity from the naming hierarchy itself.

That gap matters for agent-to-agent and client-to-agent systems. Without stronger authority semantics, discovery collapses into weak patterns: a root name trying to mean everything, generic endpoints that look official but are hard to interpret, or offchain metadata that is adjacent to identity rather than clearly authorized by it.

## Solution / long description
ÆNS makes ENS hierarchy load-bearing for agents.

The model is simple:
- the parent ENS name is the identity anchor
- a child subname represents a concrete capability
- `parent-authorized` is the milestone that makes the relationship official

In the current MVP, the narrow consumer-first flow is:
- input `pvtclawn.eth`
- derive `research.pvtclawn.eth`
- verify whether the child is parent-authorized
- return the official research endpoint if one is declared

The current build includes:
- a consumer-first CLI for research capability discovery
- a deterministic positive-path demo of the exact target flow
- a trust-oriented ENS inspector for live and example namespaces
- a live deployed public research capability page at `https://aens-nine.vercel.app/research-capability/`

ÆNS is useful because it gives software a cleaner answer to: "Which capability endpoint is official for this ENS identity?" That is a more precise primitive than a generic agent profile or endpoint directory.

## What the current build proves
- the product interface for consumer-first capability discovery exists
- the capability-authority model is implemented and demoable
- the preferred public research surface is live
- the build can distinguish official/parent-authorized from merely adjacent metadata

## What it does not overclaim
- full runtime invocation proof
- payment-flow proof
- end-to-end liveness unless explicitly checked
- that `pvtclawn.eth` is already fully published live as a parent-authorized research capability under ENS today

## Why this is differentiated
Many adjacent ENS/agent projects focus on identity wrappers, registries, or profile surfaces. ÆNS focuses on a narrower but more load-bearing primitive: official capability discovery from the ENS hierarchy itself.

The differentiator is:
- `pvtclawn.eth` = who
- `research.pvtclawn.eth` = what
- `parent-authorized` = why the endpoint is official

## Demo flow for judges
1. Open the public discovery route:
- `https://aens-nine.vercel.app/discover-research/`
2. Run the exact consumer-first positive-path demo locally if needed:
```bash
bun run discover-research -- --example parent-authorized-capability
```
3. Show the live preferred public surface:
```bash
bun run check-public-surface
```
4. Open:
- `https://aens-nine.vercel.app/`
- `https://aens-nine.vercel.app/research-capability/`

Optional honesty check of the current unpublished live namespace:
```bash
bun run discover-research -- pvtclawn.eth
```

## Repo URL
- `https://github.com/pvtclawn/aens`

## Deployed URL
- `https://aens-nine.vercel.app/`

## Helpful resources
- repo README
- `docs/submission/SYNTHESIS-COMPETITIVE-POSITIONING-2026-03-21.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`

## Submission metadata draft
### Agent framework / harness
- OpenClaw main agent workflow

### Model
- Default development model: `openai-codex/gpt-5.3-codex`
- This polishing session used `openai-codex/gpt-5.4`

### Tools used
- file editing (`read`, `write`, `edit`)
- shell execution (`exec`)
- browser inspection (`browser`)
- web research (`web_search`, `web_fetch`)
- memory/context tools for continuity

### Skills used
- No special domain skill drove the core submission/docs pass; work was done directly in the repo and browser research flow.

### Intention
- **continuing**

## Still required before final publish
Per the Builder Guide, these should still be prepared explicitly:
- **demo video URL** — strongly recommended, public, short, clear
- **conversation log** — plain text export or file link
- **cover image** — optional but useful
- **helpful resources** — optional, but worth filling with README/submission docs

## Best final judge-facing sentence
**ÆNS is the ENS-native primitive for discovering official child capabilities from a root agent identity.**
