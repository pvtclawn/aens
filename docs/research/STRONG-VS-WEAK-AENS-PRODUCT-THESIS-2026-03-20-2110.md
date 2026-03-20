# Strong vs weak ÆNS product thesis (2026-03-20 21:10 UTC)

## Purpose
Freeze the product fork that direct user pushback exposed:
- what version of ÆNS is actually worth keeping
- what version should probably be killed

This is not a branding exercise.
It is a product-direction filter.

## Strong version worth keeping
### ÆNS as an ENS-native official capability registry for machine-readable endpoints

Core thesis:
- a parent ENS identity can publish official child capabilities/endpoints
- software can discover them
- software can verify they are parent-authorized
- the parent identity remains stable while child endpoints can rotate or be revoked

Examples of child capabilities:
- research endpoint
- payment endpoint
- chat endpoint
- API endpoint
- other agent-facing machine-readable capabilities

### Why this version has teeth
This version enables useful actions for software, not just humans:
- discover the official endpoint set for an ENS identity
- reject unofficial/spoofed child endpoints
- survive endpoint rotation while keeping one stable parent identity
- consume a machine-readable registry instead of a vague profile page

### Shortest strong pitch
> ÆNS lets an ENS identity publish official machine-readable capabilities — like research, payment, chat, or API endpoints — so people and software can verify which services actually belong to it.

## Weak version to kill
### Kill the "verified ENS profile with official tools/pages" story

Why:
- too generic
- too close to a nicer profile page or ENS Linktree
- too dependent on humans merely “feeling more confident”
- too weak if software cannot actually consume the output

This weak version collapses into:
- fancy metadata
- official-looking subdomains
- attribution theater
- a naming convention with extra steps

### Kill criterion
If ÆNS only proves that humans can feel more confident about which page is official, then it is probably not worth keeping.

## The real test
Ask this:
### What useful action becomes possible because of ÆNS verification that was not possible before?

Good answer:
- software can discover and trust the official endpoint set for an identity
- software can verify that a child endpoint is parent-authorized
- software can survive endpoint rotation/revocation cleanly

Weak answer:
- humans feel more confident
- it looks more official
- subdomains are organized more nicely

If the answer stays in the weak set, cut the product direction.

## MVP worth building if the strong thesis is kept
A minimal but meaningful MVP should include:

### 1) One stable parent identity
Example:
- `pvtclawn.eth`

### 2) At least one real child capability
Example:
- `research.pvtclawn.eth`

### 3) Machine-readable child endpoint metadata
Enough for a client to resolve:
- capability type
- service URL
- parent relationship
- parent authorization status

### 4) One actual consumer
Not just a proof note.
A real consumer should be able to:
- input the parent ENS name
- discover official child capabilities
- verify which ones are parent-authorized
- output the endpoint to use

### 5) One real end-to-end demo
Something like:
- input: `pvtclawn.eth`
- output: the official research capability/endpoint
- verification: child is parent-authorized
- action: open/use the official endpoint

## What to cut immediately if the strong thesis is kept
Cut or demote:
- generic `verified profile` framing as the main story
- generic `official pages/tools` framing as the main story
- anything that does not end in machine-readable capability discovery
- broad product copy that sounds like a profile page with nicer links
- features that optimize publisher comfort while leaving consumer/software value vague

## Suggested near-term product lens
Judge every new feature by this question:
### Does this help software discover, verify, or consume official capabilities under one ENS identity?

If no, it is probably secondary or should be cut.

## Synthesis-style submission angle
If ÆNS is submitted at all, the strongest angle is:
> ENS-native official capability registry for agents/apps/endpoints

Not:
> verified ENS profile with official pages

## Bottom line
Keep ÆNS only if it becomes:
- official
- machine-readable
- consumable by software
- parent-authorized under one ENS identity

Kill the softer version where it is only:
- a verified profile
- official-looking pages
- fancy attribution metadata
