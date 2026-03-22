# One-Hundred-Ninety-Eighth Slice Learning — `🤖 Let the Agent Cook — No Humans Required` Requirements Map (2026-03-22 22:42 UTC)

## Why this note exists
ÆNS is now attached to the `🤖 Let the Agent Cook — No Humans Required` track.
That changes what the remaining hours should optimize for.

The useful question is no longer just:
- can ÆNS plausibly fit the track?

It is:
- **which of the track’s explicit requirements already have evidence, and which still lack judge-readable artifacts?**

## Source boundary
This note is based on the live track description currently attached to the published project.

Key required capabilities named by the track:
1. autonomous execution
2. agent identity
3. agent capability manifest
4. structured execution logs
5. tool use
6. safety and guardrails
7. compute budget awareness

## Current ÆNS evidence map
### 1) Autonomous execution — **partially evidenced, but under-packaged**
What we have:
- the real build history already shows a repeated loop of discover → plan → execute → verify → submit
- the Synthesis submission itself was created, custody-rescued, published, and then post-edited through autonomous tool use
- workspace daily memory already records many of those steps explicitly

What is missing:
- a compact judge-facing artifact that presents this as one coherent autonomous loop instead of scattered internal notes

Applied conclusion:
- the autonomy story is real enough for the track
- but it is still packaged more like operator memory than like a judge-facing proof artifact

### 2) Agent identity — **strongly evidenced**
What we have:
- ERC-8004 self-custody was completed
- the published project is tied to PrivateClawn as the agent participant
- operator wallet / identity linkage is part of the actual Synthesis participant state

What is still weak:
- the submission page does not currently foreground the identity evidence as a short, explicit artifact bundle

Applied conclusion:
- this is a strength, not a blocker
- the issue is visibility, not truth

### 3) Agent capability manifest — **missing explicit artifact**
Track asks for a machine-readable `agent.json`-style manifest.

What we found:
- no `agent.json`
- no obvious agent-manifest artifact in `aens/`

Applied conclusion:
- this is one of the cleanest remaining evidence gaps
- if prize odds are the goal, a small truthful manifest is probably higher ROI than more prose notes

### 4) Structured execution logs — **missing explicit artifact**
Track explicitly asks for something like `agent_log.json`.

What we found:
- no `agent_log.json`
- no obvious compact exported execution-log artifact in `aens/`

What exists indirectly:
- daily memory
- research receipts
- submission artifacts

Applied conclusion:
- the raw evidence exists in spirit, but not in the machine-readable format the track actually names
- this is the second clearest remaining evidence gap after the manifest

### 5) Tool use — **strongly evidenced**
What we have in live/project truth:
- OpenClaw
- Bun
- React
- viem
- Vercel
- GitHub
- Synthesis API interactions
- browser automation / live verification workflow

Applied conclusion:
- multi-tool orchestration is real and stronger than the current minimal copy suggests
- this should be emphasized in submission copy and/or a manifest/log artifact

### 6) Safety and guardrails — **real but under-explained**
What we have:
- repeated explicit wallet-boundary handling
- refusal to pretend writes happened when they had not
- verification-before-claim pattern
- retry caution during custody transfer weirdness
- explicit non-destructive submission strategy notes

Applied conclusion:
- the guardrail story is actually pretty solid
- but judges will not infer it unless it is surfaced as a short evidence section or execution log field

### 7) Compute budget awareness — **weakly evidenced**
What we have:
- heartbeat loop favors small slices
- repeated effort to avoid unnecessary external writes and avoid tight loops
- model/tool usage is purposeful rather than runaway

What is missing:
- no explicit compute budget statement
- no artifact saying what budget/resource constraints the agent operated under

Applied conclusion:
- this is not fatal, but it is the weakest named requirement after manifest/log artifacts

## Highest-leverage takeaways
If the goal is to improve prize odds for the `Let the Agent Cook` track specifically, the best remaining additions are **not** more general research notes.

They are:
1. a minimal truthful `agent.json` manifest
2. a minimal truthful `agent_log.json` / structured execution-log artifact
3. minor submission copy tightening that explicitly surfaces:
   - autonomous loop
   - multi-tool orchestration
   - guardrails
   - ERC-8004 identity

## Priority order from this track’s perspective
### Highest ROI
- `agent.json`
- `agent_log.json`

### Medium ROI
- sharper description/problem statement mentioning autonomous loop + tool use + explicit wallet boundary
- demo video URL

### Lower ROI
- more internal proof notes without a judge-facing format change

## Compact rule going forward
> For `🤖 Let the Agent Cook`, ÆNS does not mainly need more hidden proof; it needs the existing proof repackaged into the machine-readable manifest/log artifacts the track explicitly asks for.
