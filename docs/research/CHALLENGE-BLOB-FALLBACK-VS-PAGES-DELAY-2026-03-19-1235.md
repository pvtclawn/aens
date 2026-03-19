# Challenge — blob fallback vs Pages delay (2026-03-19 12:35 UTC)

## Purpose
Red-team the current blocked-state fork:

> if GitHub Pages still does not go live after the minimal repo-admin step, should the first live ÆNS proof temporarily fall back to the reachable GitHub blob stub URL, or should the project keep the cleaner Pages URL frozen even if that delays the onchain publish?

## Verdict
The larger risk is **letting service-surface polish block the first live authority proof indefinitely**.

A cleaner Pages URL is better, but it is not the core thesis.
The core thesis is:
- root identity
- child capability
- parent authorization
- public machine-readable inspectability

So if the one explicit repo-admin Pages step does **not** unblock the cleaner route, a temporary blob fallback is less damaging than indefinite delay.

## Main risks
### 1. Polish-hostage risk
If the first live proof remains blocked on whether the service URL is aesthetically clean, then a non-core surface detail can stall proof of the actual authority model.

**Guardrail:** try the one Pages settings step first, but do not let that boundary hold the whole first proof hostage forever.

### 2. Blob fallback aesthetic risk
A GitHub blob URL is honest and reachable, but it looks more like source browsing than a clean capability surface.

**Guardrail:** if blob fallback is used, label it explicitly as a temporary public stub in the proof artifact and keep the Pages route as the preferred later upgrade.

### 3. Future-update risk
A blob fallback means the child `aens.service` value will likely need a later ENS update when Pages becomes live.

**Guardrail:** record the first-publish service URL explicitly and treat the later URL cleanup as a second small maintenance step, not a silent mutation.

### 4. False-binary risk
The choice is not:
- Pages forever
- or blob forever

The real choice is:
- try the smallest Pages unblock step first
- if that fails, decide whether temporary fallback is better than delay

**Guardrail:** keep Pages as the preferred target even if the first live publish uses the blob stub.

## Decision rule
### Preferred path
1. Human-admin step:
   - `Settings → Pages → Source = GitHub Actions`
   - or toggle/re-save if already set
2. Rerun:
   - `bun run check-public-surface`

### If Pages is live
- keep `https://pvtclawn.github.io/aens/research-capability/` as the planned `aens.service`
- proceed with the first live ENS publication using that URL

### If Pages still is not live
- allow temporary fallback to the reachable GitHub blob stub URL
- proceed with the first live authority proof
- record the fallback explicitly as bootstrap-only
- keep Pages cleanup as the preferred follow-up surface upgrade

## Bottom line
**Do not let the first live ÆNS authority proof be blocked indefinitely by a cleaner-but-nonessential service URL.**

Pages is preferred.
But if the one-step admin fix does not unblock it, temporary blob fallback is the better failure-handling path than endless delay.
