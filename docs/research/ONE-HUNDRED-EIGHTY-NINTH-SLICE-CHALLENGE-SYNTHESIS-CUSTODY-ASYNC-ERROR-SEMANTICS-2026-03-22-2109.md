# One-Hundred-Eighty-Ninth Slice Challenge — Synthesis Custody Async Error Semantics (2026-03-22 21:09 UTC)

## Trigger
The live Synthesis custody state flipped to:
- `custodyType: self_custody`
- `ownerAddress: 0xeC6cd01f6fdeaEc192b88Eb7B62f5E72D65719Af`
- `selfCustodyVerifiedAt: 2026-03-22T21:09:35.202Z`

This happened **after** the earlier transfer-confirm path produced confusing failure signals, including:
- timeout during confirm
- later `replacement transaction underpriced`
- stale publish blocker language saying all members still needed self-custody

So the dangerous thing is not just custody failure.
It is **misleading asynchronous error semantics** around a custody transition that may actually complete after the first apparent failure.

## Core critique
The current operational risk is:

> an agent can observe a transport/backend error, conclude the custody transfer failed, and stop one step too early — even though the authoritative participant state may flip to self-custody moments later.

That creates a bad outcome on both sides:
- **under-action:** stop at "blocked" when the publish gate may already be cleared
- **over-action:** repeatedly re-init / re-confirm transfer attempts and create nonce collisions, duplicate sends, or more confusing backend errors

## What this reveals
The Synthesis custody flow is not well modeled as a single synchronous request/response truth source.
At least in practice, the safer truth hierarchy is:

1. **authoritative participant state** (`GET /participants/me`)
2. **publish outcome** (`POST /projects/:uuid/publish`)
3. transfer init/confirm responses
4. transport-layer timeouts / backend error text

The earlier handling risk was giving too much weight to item 4.

## Failure modes exposed
### 1) False-negative custody diagnosis
A timeout or backend 500 may mask a transfer that is still propagating or eventually mined.

### 2) Nonce-collision amplification
If a first custody transaction is already pending, repeated confirm calls can produce `replacement transaction underpriced` and make the situation look worse than it is.

### 3) Stale blocker messaging
Telling the operator "publish is blocked by self-custody" after the state has already flipped becomes actively misleading.

### 4) Wrong escalation target
The wrong narrative is:
- "we still need a wallet"

The better narrative is:
- "the custody handoff is asynchronous; re-read authoritative state before declaring failure or retrying"

## Mitigation rule
For future Synthesis custody work:

1. If transfer init succeeds, treat confirm errors as **provisional**, not final.
2. After any timeout / 5xx / nonce-pricing error, immediately re-check `GET /participants/me` before retrying anything.
3. Only re-init or re-confirm if participant state still says `custodial` after that re-check.
4. Before telling the user a publish gate is still blocked, re-check both:
   - participant custody state
   - actual publish endpoint

## Practical next-step boundary
The important boundary changed at 21:09 UTC:
- self-custody is now verified
- the previous custody blocker may already be stale

So the next meaningful question is no longer "can custody succeed?"
It is:

> does publish succeed now that self-custody is actually verified?

## Compact rule going forward
Do not treat Synthesis transfer errors as final truth.
Treat **participant state** as truth, and treat transfer-response failures as possibly stale or intermediate until state is re-read.
