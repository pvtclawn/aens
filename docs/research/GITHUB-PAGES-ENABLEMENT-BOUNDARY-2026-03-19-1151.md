# GitHub Pages enablement boundary for the ÆNS repo (2026-03-19 11:51 UTC)

## Purpose
Narrow the exact GitHub Pages boundary that is currently blocking the cleaner planned public stub URL from becoming live:
- `https://pvtclawn.github.io/aens/`
- `https://pvtclawn.github.io/aens/research-capability/`

## Current observed facts
### Repo/workflow side
- `.github/workflows/pages.yml` is committed and public
- the repo exposes a public workflow page for `Deploy GitHub Pages`
- local checks pass:
  - `bun test`
  - `bunx tsc --noEmit`
  - `bun run inspect --example parent-authorized-capability`
- current source-of-truth docs/examples now reference the Pages URL as the planned `aens.service` target

### Public web side
Even after an extra settle window, both still return GitHub Pages 404:
- `https://pvtclawn.github.io/aens/`
- `https://pvtclawn.github.io/aens/research-capability/`

## Relevant GitHub docs
### 1. Custom workflows must be enabled for the repository first
GitHub Docs (`Using custom workflows with GitHub Pages`) says:
- to start using custom workflows, you must first **enable them for your current repository**
- for more information, see `Configuring a publishing source for your GitHub Pages site`

### 2. Pages is configured in repo Settings → Pages
GitHub Docs (`Configuring a publishing source for your GitHub Pages site`) says the publishing source is chosen under:
- repository **Settings**
- **Pages**
- **Build and deployment**
- **Source**

This is the load-bearing repo-side setting boundary.

## Most likely explanation
A useful reading constraint from `books_and_papers/006_think_distributed_systems.pdf`: a complete mental model must include every **relevant fact** that changes the outcome.

Applied here, the repo-admin Pages setting is not deployment trivia. For this slice it is part of the product surface, because it determines whether the cleaner planned public service URL exists at all.

The repo currently has the workflow file and workflow page, but the repository likely still needs a one-time Pages settings step such as:
- opening **Settings → Pages**
- setting **Source** to **GitHub Actions**

Possibly, if Pages was previously in a weird state, it may also need a one-time refresh/toggle in the Pages settings UI.

## Why this is the best current interpretation
This best fits all currently observed facts:
- workflow file exists
- Actions surface is visible
- local site artifact shape is correct
- public Pages URLs still 404 with GitHub’s generic “There isn't a GitHub Pages site here” page

That pattern looks more like **Pages not yet enabled/published for the repo** than like a local site-build bug.

## Exact human step to test next
With repo admin access, open:
- `https://github.com/pvtclawn/aens/settings/pages`

Then check:
1. Is GitHub Pages enabled for this repo?
2. Under **Build and deployment**, is **Source** set to **GitHub Actions**?
3. If it already is, does toggling/re-saving the Pages source refresh publication?
4. After saving, does the `Deploy GitHub Pages` workflow run/publish?

## What not to do yet
- do **not** revert immediately to the blob/raw URL
- do **not** add more local site files first
- do **not** change the live ENS write plan based on a Pages settings issue alone

## Best next move
# **Human-admin Pages settings check / enablement**

This is a human/browser/repo-admin boundary, not a local code boundary.

If Egor is present and willing, the next clean step is:
1. open repo Settings → Pages
2. confirm or set **Source = GitHub Actions**
3. let the workflow publish
4. re-check the public Pages URLs

## Bottom line
The current blocker is most likely **one-time GitHub Pages repo enablement / source configuration**, not missing local site code.

That means the next meaningful step is a small human-admin repo settings action, after which the Pages-backed stub should be re-verified before it is treated as the live planned `aens.service` target.
