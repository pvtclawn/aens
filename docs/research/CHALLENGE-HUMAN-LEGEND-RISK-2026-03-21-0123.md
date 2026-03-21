# Challenge — the human legend can still make ÆNS feel like wrapperware (2026-03-21 01:23 UTC)

## Purpose
Red-team the new human-facing legend for the wrapped agent-judge artifacts before it becomes the default submission posture.

The legend is directionally useful.
The question here is: **why might it still fail with human judges?**

## What was challenged
Current proposed bridge:
- short narrative sentence
- link to wrapped artifacts
- tiny three-part legend:
  1. result type
  2. provenance
  3. live public status

This is cleaner than raw JSON dumping.
But it still has real risks.

## Main critique
The human legend solves the **"how do I read this JSON?"** problem better than before, but it can still worsen the more important human question:

> **"Why should I care about this product at all?"**

If the first human-facing explanation is about wrapper fields, commits, and status blocks, ÆNS can start feeling like infrastructure about infrastructure.
That is dangerous in a hackathon context.

## Weakness 1 — it still starts inside the wrapper, not inside the user problem
The reading order begins with:
- `sourceMode`
- `exampleId`
- authorization fields

That is sensible for interpretation.
But it still means the human’s first contact is with artifact semantics rather than the product question.

### Why this matters
A human judge may remember:
- JSON wrapper
- provenance fields
- deployment caveats

and still fail to remember:
- root ENS identity
- child capability
- official endpoint discovery
- why this is different from a profile or registry page

That is a bad trade.

### Mitigation
Before the legend, add one **judge shortcut line**:

> "This artifact answers one question: given a root ENS identity, what is the official research endpoint and is it actually parent-authorized?"

Only after that should the legend explain the wrapper.

## Weakness 2 — `officialEndpointDeclared` is still too easy for humans to over-read
The legend correctly says `officialEndpointDeclared` does not mean fully probed liveness.
But humans skim.

### Why this matters
A human judge may still translate:
- `officialEndpointDeclared: true`

into:
- "works now"

especially if they do not immediately pair it with:
- `livenessChecked`
- `publicSurface.preferredSurfaceReady`

### Mitigation
In human-facing explanations, never describe `officialEndpointDeclared` alone.
Always pair it with a contrast line such as:

- **Declared under parent authorization**
- **Not the same as fully live / publicly deployed**

That contrast needs to be part of the judge shortcut, not buried in the legend.

## Weakness 3 — the wrapper story can overshadow the product story
The more carefully the legend explains:
- provenance
- commit binding
- public-surface status

the more the demo risks feeling like:
- a trustworthy JSON packaging exercise

instead of:
- a new ENS-native capability-discovery primitive

### Why this matters
Judges do not reward correctness alone.
They reward product clarity and differentiated utility.

If the artifact explanation becomes the center of the submission, ÆNS can feel like:
- a polished evidence bundle
- plus a half-live route

instead of:
- a real capability-discovery product with a narrow MVP loop

### Mitigation
Keep the human order as:
1. **user problem / capability-discovery question**
2. **artifact answer in plain English**
3. **legend for reading the fields**

The legend should support the product story, not become the product story.

## Weakness 4 — too many surfaces can still feel like confusion, not rigor
Right now the submission has several surfaces:
- wrapped example artifact
- wrapped live artifact
- CLI commands
- live research capability page
- intended public discovery route
- video/script/docs

Even with better prioritization, humans may still perceive this as too many entrypoints.

### Why this matters
If a human judge feels they need a map before they can understand the demo, the submission is losing clarity.

### Mitigation
Give humans a single explicit path:
- **start here**: one sentence of value
- **then this**: example artifact for target state
- **then this**: live artifact for current truth
- **then this**: live research page as supporting surface

Everything else becomes backup, not co-equal entrypoints.

## Strongest critique sentence
The human legend reduces confusion about the wrapper, but it still risks making ÆNS feel like a carefully explained artifact bundle instead of a clear capability-discovery product.

## What this changes
This critique changes the next presentation/doc target.
The next improvement should **not** be more field explanation.
It should be a tiny human-facing preamble that restores the product question before the legend begins.

## Best next move
Smallest meaningful follow-up:
- patch submission docs so the artifact section starts with:
  1. one-line user problem
  2. one-line artifact interpretation rule (`example = target state`, `live = current truth`)
  3. then the tiny legend

## Verdict
The legend is useful, but incomplete.
Without a product-first preamble, humans may leave understanding the wrapper better than they understand ÆNS itself.
