# ÆNS artifact-first demo wording without apology (2026-03-21 01:48 UTC)

## Purpose
Freeze one applied-learning rule for the next two-doc consistency patch:

How should ÆNS demote the undeployed public `/discover-research/` route **without** making the submission sound apologetic, broken, or embarrassed?

## Core lesson
Do **not** frame the route demotion as:
- sorry, the route is not ready
- the live route is broken
- unfortunately, this demo is not deployed yet
- if the route fails, use this fallback

That language makes the product feel weaker than it is.

Instead, frame the demo around the **strongest current verified surface**.

### The right move
Lead with:
- what the current verified demo surface is
- why it is the right place to start
- how the other surfaces support it

Then mention the public route as an intended deployed surface that is still catching up.

## Why this works
This follows the same information-architecture rule already frozen for ÆNS front-door copy:
1. value first
2. mechanism second
3. proof boundary third

Applied to demo ordering, that becomes:
1. start with the strongest verified surface
2. show how it answers the product question
3. then note the current deployment boundary

This keeps the demo feeling like a product demo rather than a caveat tour.

## Best wording pattern
### Step 1 — current verified entrypoint
Use language like:

> "Start with the wrapped example artifact for the clearest current proof of the target discovery flow."

Why this is strong:
- it sounds intentional, not compensatory
- it points to the best current surface
- it keeps the emphasis on the product question, not on deployment problems

### Step 2 — current live truth check
Then say:

> "Compare it with the wrapped live artifact to see the current namespace state honestly."

Why this helps:
- it turns the live truth gap into part of the demo logic
- it makes honesty a feature, not an excuse

### Step 3 — reproducibility / supporting surface
Then say:

> "Use the CLI as a reproducibility check, and the live research capability page as the current public supporting surface."

Why this helps:
- CLI becomes backup evidence, not the first burden on judges
- the currently live page still gets a role without pretending it is the full demo surface

### Step 4 — intended deployed route with status caveat
Only then say something like:

> "The `/discover-research/` route is the intended deployed demo surface; until production catches up, treat the wrapped artifacts as the current primary truth surface."

Why this works:
- the route is not hidden
- the route is not oversold
- the caveat appears after the demo already feels coherent

## Phrases to prefer
- current verified demo surface
- primary truth surface
- current namespace truth
- intended deployed surface
- production is catching up
- reproducibility backup
- supporting public surface

## Phrases to avoid
- broken route
- dead route
- fallback because deploy failed
- unfortunately not live
- use this instead if the route does not work
- backup plan

Those phrases make the demo feel apologetic and accidental.

## Best two-line ordering template
For the two-doc patch, the best compact structure is:

> **Start with the wrapped example artifact for the clearest current proof of the target discovery flow.**
> **Then compare it with the wrapped live artifact to see current namespace truth, use the CLI as reproducibility backup, and treat `/discover-research/` as the intended deployed surface while production catches up.**

## Product-first rationale
This wording keeps the product story intact:
- the user question still comes first
- the target discovery flow still feels real
- the live truth gap becomes evidence of honesty rather than evidence of failure
- the undeployed route is demoted without making the whole submission feel like a workaround stack

## Result
The next docs patch should not sound like:
- "the route is broken, so here is Plan B"

It should sound like:
- "here is the strongest verified demo surface today, and here is how the rest of the surfaces relate to it."
