# Seventy-Seventh Slice Research — Chain-First Thin Client + Dogfooding Agent Boundary (2026-03-21 22:33 UTC)

## Goal
Freeze a compact boundary for ÆNS evolution so the product can be credibly demoed as:
1) chain-first source of truth, and
2) dogfooded by an ÆNS agent that automates publication workflows without becoming the trust root.

## Current-state observations

### Web discovery route (`app/src/discover-research-page.tsx`)
- Already supports live ENS lookup in browser via resolver + RPC fallback list.
- Still defaults to a deterministic example mode and PrivateClawn-centric defaults (`ensRoot`, fixed demo ID).

### Resolver path (`src/resolver.ts` + `api/discover-research.ts`)
- Reads ENS records from chain via `viem` (`getEnsAddress`, `getEnsText`) and classifies authority semantics.
- Service contract already emits machine-readable fields (`reasonCode`, `reasonSchemaVersion`, authorization + endpoint objects).

### Capability pages (`app/src/home.tsx`, `app/src/research-capability.tsx`)
- Currently project-owned static surfaces with PrivateClawn-specific copy.
- Useful as proof surface, but not yet generated from on-chain metadata or agent-managed publication flow.

## Actionable boundary (frozen)

### A) MUST be chain truth (non-negotiable)
These must be derivable from ENS records + resolver behavior, not from app constants:
- root identity and child capability mapping,
- parent/child authorization relationship,
- declared service URL,
- capability status verdict and reason semantics.

### B) MAY be agent-owned automation (allowed)
ÆNS agent can automate:
- capability page artifact generation,
- publication to web/CID target,
- write-intent payload generation for ENS updates,
- post-write verification and evidence capture.

But agent outputs are only **proposals/evidence** until reflected on-chain.

### C) MUST NOT be trusted as source-of-truth
- static app constants,
- unpublished markdown artifacts,
- fixture/example outputs,
- agent-maintained local state.

These are demo/dev aids only.

## Minimal dogfooding shape (v1)
1. Agent creates/updates capability page artifact for itself.
2. Agent produces deterministic ENS write plan (records + expected post-state).
3. After write, agent runs verification and emits pass/fail evidence referencing live chain reads.
4. Thin client renders only live chain-derived state (plus explicit labels when showing demo fixtures).

## Risks if boundary is not enforced
1. **Demo credibility drift:** app shows “truth” that chain does not confirm.
2. **Operator confusion:** agent automation mistaken for on-chain finality.
3. **False dogfooding claim:** “self-managed capability” without verifiable post-write chain state.

## Next smallest implementation handoff
- Keep current contract intact.
- Add explicit “data source” labeling in UI (live-chain vs demo fixture).
- Replace hardcoded identity copy in discovery flow with chain-derived primary display + optional default input.
- Define agent publish/verify interface as write-plan + post-write verification report, not direct hidden mutation path.
