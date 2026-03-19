# Challenge — live public positive example path risk (2026-03-19 10:33 UTC)

## Purpose
Red-team the planned first live public AENS positive example before building it.

## Focus
Target path:
- `pvtclawn.eth`
- `research.pvtclawn.eth`

Harsh question:

> What could make this technically succeed but still fail as trustworthy public proof?

## Verdict
The direction is correct, but the slice can still fail as **fake public proof** if it publishes a parent-authorized shape without enough real-world credibility around it.

## Main risks
1. **Hollow service surface**
   - the child classifies as callable because `aens.service` exists, but the public URL is dead, fake-looking, or unrelated to PrivateClawn control
2. **Circular self-attestation feel**
   - the parent authorizes the child and the child points back to the parent, but the whole chain still looks like one operator certifying itself with itself
3. **Resolver / propagation drift**
   - root and child updates appear in partial order, causing temporary empty or contradictory live output
4. **Cherry-picked golden path risk**
   - one happy-path live example is mistaken for broader proof of the authority model than it really is
5. **Weak artifact trail**
   - ENS state changes exist, but there is no strong saved proof surface beyond “trust me, I ran it”

## Required safeguards
- use a real reachable endpoint or clearly owned/stable capability-stub page; never an obviously fake example URL
- publish enough root metadata to make the identity legible (`description`, address, `aens.agentId`, runtime)
- keep child metadata strictly consistent with the root (`aens.parent`, `aens.agentId`, runtime, service URL)
- publish in strict sequence and verify after each step:
  1. root base fields
  2. child subname/resolver/address
  3. child fields
  4. parent capability list
- keep deterministic contrast examples in the repo so the live positive path is framed as one public proof artifact, not the whole model
- save final publication artifacts explicitly: CLI output snapshot, exact commands, and any available ENS update references / tx hashes

## Success bar for the next slice
The next build slice should not be judged only by whether the CLI prints:
- `Capability authorization: parent-authorized`

It should also satisfy:
- real/stable service surface
- legible root identity
- orderly publication sequence
- public verification artifact trail
- honest scope language about what the example does and does not prove

## Bottom line
The first live AENS positive example should optimize for **credibility**, not just classifier success.
