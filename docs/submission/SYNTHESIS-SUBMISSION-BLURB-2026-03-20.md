# Synthesis submission blurb — ÆNS

## Short blurb
ÆNS lets software discover an agent’s official capability endpoints from its ENS root identity.

Instead of treating one ENS name as a generic profile, ÆNS treats the parent name as identity and child subnames as official capability surfaces. In the current MVP, the key question is: given `pvtclawn.eth`, how do you discover the official research endpoint and verify that it is actually endorsed by that identity?

## Medium blurb
Most agent identity systems can tell you who an agent is, or where some endpoint lives. ÆNS is about something more precise: official capability discovery from ENS hierarchy.

In ÆNS, the parent name is the identity anchor and a child subname is a concrete capability surface. That means:
- `pvtclawn.eth` answers who the agent is
- `research.pvtclawn.eth` answers what capability it exposes
- `parent-authorized` answers why the endpoint should be treated as official

The current build demonstrates that primitive through a consumer-first CLI, a deterministic positive-path demo, and a live deployed public research page. It does not overclaim full runtime or payment closure, and it does not pretend the live `pvtclawn.eth` namespace is already fully published under ENS today.

## Form-field version
ÆNS is an ENS-native capability discovery system for agents. The parent ENS name anchors identity, a child subname expresses a concrete capability, and the system can classify whether that capability is actually parent-authorized under the parent. In the current MVP, the consumer flow is: input `pvtclawn.eth`, derive `research.pvtclawn.eth`, verify whether it is official, and return the endpoint it declares.

## One-sentence pitch
ÆNS is the ENS-native primitive for discovering official child capabilities from a root agent identity.
