# Plan — branch between live ÆNS wallet session and public-stub upgrade (2026-03-19 11:31 UTC)

## Purpose
Stop oscillating between two qualitatively different next moves:
1. the real live ÆNS publication session
2. more local/offline prep while Egor is unavailable

Freeze one explicit branch rule so the next work is determined by **human availability**, not by indecision.

## Current state
ÆNS already has:
- frozen live-publication payloads
- wrapped-root / resolver write-path research
- resolver-first guardrails
- first live-session checklist
- concise operator steps
- reusable proof-capture helper
- verification artifacts for all of the above

So the project is now beyond generic local-prep scarcity.

## Hard branch rule
### Branch 1 — **Egor is present and explicitly ready for wallet approvals**
Trigger only if all are true:
- Egor is actively present in chat / at the machine
- Egor is ready to connect the wrapped-owner wallet
- Egor is ready to approve mainnet ENS transactions in the browser

#### Then do this
Run the real live ÆNS write session using the already-frozen runbook:
- `docs/research/CHECKLIST-FIRST-LIVE-AENS-WRITE-SESSION-2026-03-19-1112.md`
- `docs/research/FIRST-LIVE-AENS-WRITE-SESSION-OPERATOR-STEPS-2026-03-19-1115.md`

#### First phase only
Start with one controlled session that includes:
1. resolver modernization on `pvtclawn.eth`
2. root records on `pvtclawn.eth`

Then checkpoint with:
- `bun run capture-proof -- baseline`
- `bun run inspect pvtclawn.eth`
- `bun run capture-proof -- post-root`

Proceed to child creation only if the root is coherent.

#### Success criterion for Branch 1
The branch counts only if the live session reaches either:
- full success, eventually ending in a live `parent-authorized` child, or
- captured abort with explicit tx/proof artifacts

#### Do not do
- do not invent a new write path
- do not add more operator notes mid-session
- do not treat partial completion as success

---

### Branch 2 — **Egor is not present / not ready for wallet approvals**
Trigger if any of the Branch 1 conditions are false.

#### Then do this
Ship exactly one adjacent improvement:
# **upgrade the public stub surface from GitHub blob/raw to a cleaner owned web path**

#### Why this is the right blocked-path move
The current planned `aens.service` target is honest but aesthetically weak:
- GitHub blob page
- raw GitHub content URL

Those are reachable, but they are not the strongest public-facing capability surface.
If waiting continues, improving this surface strengthens the eventual live proof artifact more than another checklist or helper would.

#### Best target shape
Preferred target:
- GitHub Pages for the `aens` repo, or equivalent simple owned landing page under PrivateClawn control

Preferred public URL shape:
- `https://pvtclawn.github.io/aens/`
- or a similarly clean owned route for the research capability stub

#### Smallest useful Branch 2 slice
1. create the smallest clean static page for the research capability stub
2. make it publishable under a cleaner owned web path
3. update the frozen planned `aens.service` target to that cleaner URL
4. verify the page is reachable publicly
5. stop there

#### Success criterion for Branch 2
The blocked-path branch counts only if it produces:
- a cleaner owned public page
- a reachable URL
- updated frozen service target in repo docs/examples if needed
- no new wallet-dependent work

#### Do not do
- do not add more general live-session runbooks
- do not add another proof helper
- do not reopen ENS write-path theory unless a new external fact appears
- do not start an unrelated feature slice

## Explicit non-goals
This branch plan does **not** mean:
- “always wait forever for the wallet”
- “always keep polishing local docs”
- “switch to a second input mode or unrelated feature while blocked”

It means:
- if human wallet approval is available, do the real live thing
- if not, improve the one remaining weak part of the eventual proof surface

## Acceptance criteria
1. The next move is determined by the human-availability branch rule, not ad hoc judgment.
2. Branch 1 points directly at the live runbook and proof helper.
3. Branch 2 points directly at the public-stub-surface upgrade and nothing broader.
4. The plan explicitly forbids more low-value prep loops.

## Next task
# **If Egor is not explicitly present for wallet approvals, build the smallest clean owned public stub surface next.**

That is the default blocked-path move now.

If Egor becomes available instead, override immediately to the live wallet session.
