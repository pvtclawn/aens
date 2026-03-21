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
1. Start with the wrapped example artifact for the clearest current proof of the target discovery flow:
- `docs/submission/artifacts/discover-research-example.json`
2. Open the live research capability page as the first public visual anchor:
- `https://aens-nine.vercel.app/research-capability/`
3. Compare it with the wrapped live artifact to show current namespace truth honestly:
- `docs/submission/artifacts/discover-research-live.json`
4. Use CLI as reproducibility backup and public-surface evidence:
```bash
bun run discover-research -- --example parent-authorized-capability --json
bun run discover-research -- --json pvtclawn.eth
bun run check-public-surface
```
5. Use the live public discovery route as part of the current truth surface:
- `https://aens-nine.vercel.app/discover-research/`

## Repo URL
- `https://github.com/pvtclawn/aens`

## Deployed URL
- `https://aens-nine.vercel.app/`

## Helpful resources
- repo README
- `docs/submission/SYNTHESIS-COMPETITIVE-POSITIONING-2026-03-21.md`
- `docs/submission/SYNTHESIS-DEMO-SCRIPT-2026-03-20.md`
- `docs/submission/SYNTHESIS-CORE-SUBMISSION-2026-03-20.md`
- `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md`
- `docs/research/AGENT-JUDGE-PACKAGING-RULE-2026-03-21-0047.md`

## Tiny judge entry map (30 seconds)
- **User problem:** from a root ENS identity, find the official research capability endpoint and whether it is parent-authorized.
- **Deterministic proof:** `docs/submission/artifacts/discover-research-example.json`
- **Live surface:** `https://aens-nine.vercel.app/research-capability/`
- **Boundary:** `officialEndpointDeclared` proves declaration/authorization, not guaranteed runtime liveness by itself.

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

## Final binary submit rule
Use `docs/submission/SYNTHESIS-FINAL-SUBMISSION-BUNDLE-INDEX-2026-03-21.md` as the source of truth.

- **NO-SUBMIT** unless all four gate dimensions pass: presence, content integrity, judge accessibility, and commit-pin consistency.
- **SUBMIT-READY** only when those four dimensions pass and the technical gate (runtime + docs + artifacts aligned) is still green.
- During no-change periods, follow the bundle index wait-loop operations (freshness window + drift check + reminder floor + judge-access checks + trend markers) to avoid stale assumptions.

## Agent-judge packaging add-on
These wrapped artifacts answer one product question:
**given a root ENS identity, what is the official research endpoint, and is it actually parent-authorized?**

Read them with one simple rule:
- **example artifact** = deterministic target state
- **live artifact** = current namespace truth

Important non-overclaim boundary:
- **`officialEndpointDeclared` means the endpoint is declared under parent authorization**
- it does **not** mean the endpoint is fully live or publicly deployed right now

Because ÆNS may be judged by agents as well as humans, also prepare:
- **deterministic JSON artifact** from `bun run discover-research -- --example parent-authorized-capability --json`
- **live JSON artifact** from `bun run discover-research -- --json pvtclawn.eth`

Canonical packaging command:
```bash
bun run package-submission-artifacts
```

Canonical artifact paths:
- `docs/submission/artifacts/discover-research-example.json`
- `docs/submission/artifacts/discover-research-live.json`

Tiny human-reading legend:
- **result type** → what kind of answer this is
- **provenance** → when/how/from which commit it was produced
- **live public status** → what is actually deployed right now

The wrapped JSON artifacts remain the strongest machine-facing judge surface, now alongside a live preferred public discovery route.

Reasoning is frozen in:
- `docs/research/AGENT-JUDGE-PACKAGING-RULE-2026-03-21-0047.md`
- `docs/research/HUMAN-LEGEND-FOR-AGENT-ARTIFACTS-2026-03-21-0118.md`

## Best final judge-facing sentence
**ÆNS is the ENS-native primitive for discovering official child capabilities from a root agent identity.**
