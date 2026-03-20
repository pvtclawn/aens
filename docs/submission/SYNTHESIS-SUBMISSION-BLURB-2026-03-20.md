# Synthesis submission blurb — ÆNS

## Short blurb
ÆNS makes `<capability>.<agent>.eth` load-bearing.

Instead of using one ENS name as a generic profile or endpoint, ÆNS treats the parent name as the identity anchor and a child subname as an authorized capability surface. In the demo, `pvtclawn.eth` anchors identity and `research.pvtclawn.eth` represents a concrete capability. The key milestone is that the child is classified as `parent-authorized`, making the parent/child relationship meaningful instead of decorative.

## Medium blurb
Most agent identity systems can tell you who an agent is, or where some endpoint lives. ÆNS is about something more precise: making ENS hierarchy carry capability trust semantics.

In ÆNS, the parent name is the identity anchor and a child subname is a concrete capability surface. That means:
- `pvtclawn.eth` answers who the agent is
- `research.pvtclawn.eth` answers what capability it exposes

The real protocol milestone is not just that a subname exists or a URL is reachable. It is that the child capability is recognized as `parent-authorized` under the parent identity.

This submission demonstrates one live ENS-backed authority path using that model. It does not overclaim full runtime or payment closure; it proves the narrower but more important primitive first: ENS-native parent-authorized child capability authority.

## Form-field version
ÆNS turns ENS subnames into agent capability primitives. The parent ENS name anchors identity, the child subname expresses a concrete capability, and the system can classify whether that capability is actually authorized under the parent. In the live demo, `pvtclawn.eth` is the identity anchor and `research.pvtclawn.eth` is the child capability, with `parent-authorized` as the key milestone. This makes `<capability>.<agent>.eth` load-bearing instead of decorative.

## One-sentence pitch
ÆNS makes ENS hierarchy meaningful for agents by turning child subnames into parent-authorized capability surfaces.
