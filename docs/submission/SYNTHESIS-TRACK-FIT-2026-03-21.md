# Synthesis track fit — ÆNS (2026-03-21)

## Purpose
Decide the best Synthesis track framing for the current product truth, not for the older research/discovery version of the project.

## Recommended order
1. **ENS Open Integration**
2. **ENS Identity**

## Why ENS Open Integration is the strongest fit
ÆNS uses ENS as a live application primitive, not as decorative profile metadata.

The current product does two concrete things with ENS:
- reads current root-state records
- prepares the exact write payload for `aens.*` record publication

That makes it a strong ENS integration story: the app is only useful because ENS is the core object being read and written.

## Why ENS Identity still fits
Identity is still part of the story because the root ENS name is the anchor the user starts from. But identity alone is not the whole product:
- the explorer is useful because it shows the current root state,
- the write flow is useful because it turns that state into the next exact write.

So ENS Identity is a good secondary track, not the headline.

## What not to lead with
Do **not** lead the submission as:
- research endpoint discovery
- generic agent registry
- generic ENS profile page
- messaging or payment infrastructure

Those framings either describe old product fiction or blur the actual submission.

## Judge-facing framing
Use this sentence:

> ÆNS is a narrow ENS utility that helps operators inspect root identity state and prepare the exact `aens.*` writes needed to publish capability metadata.

## Bottom line
Best current track framing:
- **primary:** ENS Open Integration
- **secondary:** ENS Identity
