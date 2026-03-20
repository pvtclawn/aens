# Synthesis demo script — ÆNS (2 minutes)

## Goal
Show the core ÆNS idea clearly:
- `pvtclawn.eth` = identity anchor
- `research.pvtclawn.eth` = child capability
- `parent-authorized` = the real milestone

This is a **capability-authority** demo, not a full runtime/payment demo.

## 2-minute script

### 0:00–0:15 — Open with the problem
"Most agent identity systems can tell you who an agent is, or where some endpoint lives. But they usually don’t make a child capability meaningfully authorized under a parent identity. ÆNS is about making `<capability>.<agent>.eth` load-bearing."

### 0:15–0:35 — State the thesis plainly
"In ÆNS, the parent ENS name anchors identity, and the child subname represents a concrete capability. So:
- `pvtclawn.eth` tells you who the agent is
- `research.pvtclawn.eth` tells you what capability it exposes"

### 0:35–1:05 — Show the parent
Run:
```bash
bun run inspect pvtclawn.eth
```
Narrate:
"This is the parent identity anchor. It’s the top-level agent identity we want capability subnames to inherit meaning from."

### 1:05–1:35 — Show the child capability
Run:
```bash
bun run inspect research.pvtclawn.eth
```
Narrate:
"This is the child capability surface. The key thing here is not just that a subname exists. The key thing is whether the system recognizes it as meaningfully attached to the parent."

### 1:35–1:50 — Highlight the milestone
Point directly to the authority classification.
Say:
"The important milestone is `parent-authorized`. That means the child capability is being interpreted as a capability under the parent identity — not just as random adjacent metadata or a generic endpoint."

### 1:50–2:05 — Show the public-surface check
Run:
```bash
bun run check-public-surface
```
Narrate:
"This checks the currently reachable public surface. For this demo, the claim stays narrow: authority path plus current public capability surface. We are not claiming full runtime/payment closure here."

### 2:05–2:20 — Close on the wedge
"That’s the core of ÆNS: not generic discovery, not generic provenance, but ENS-native child capability authority.
- `pvtclawn.eth` = who
- `research.pvtclawn.eth` = what
- `parent-authorized` = why the relationship matters"

## Live-demo emphasis
Keep repeating these three points:
1. the hierarchy means something
2. the child capability is the center of the design
3. `parent-authorized` is the real protocol milestone

## Do not overclaim
Avoid saying this demo proves:
- full invocation
- payment flow
- runtime auth
- broad production readiness
- end-to-end machine closure

## Good final one-liner
"ÆNS makes `<capability>.<agent>.eth` load-bearing by treating the parent name as identity, the child subname as capability, and `parent-authorized` as the trust milestone."
