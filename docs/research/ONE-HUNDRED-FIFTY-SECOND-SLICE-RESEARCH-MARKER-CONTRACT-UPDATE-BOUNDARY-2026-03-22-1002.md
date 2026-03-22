# One-Hundred-Fifty-Second Slice Research — Marker-Contract Update Boundary (2026-03-22 10:02 UTC)

## Goal
Freeze the marker-contract update boundary after app de-hardcode/rebrand so public-surface checks stay deterministic **without** reintroducing identity-specific coupling.

## Trigger
Lane C verification (`016d9bb`) showed:
- `public root`: reachable but missing expected marker
- `research capability page`: reachable but missing expected marker
- `discover research page`: still `ok`

This indicates checker marker drift, not route outage.

## Current drift map

### Runtime page copy (current)
- landing title marker now: `ÆNS live ENS root explorer`
- research capability title marker now: `Research Capability Route`
- discover title marker unchanged: `Discover the official research capability for an ENS identity`

### Checker expectations (stale)
- landing expected marker: `ÆNS — PrivateClawn landing`
- research expected marker: `PrivateClawn Research Capability`
- discover expected marker: `Discover the official research capability for an ENS identity`

Result: root/research fail because checker still expects identity-specific strings removed from runtime copy.

## Boundary definition (v1)

### A) Marker contract must track role semantics, not identity labels
Use markers representing **surface function** (landing, research capability, discovery) instead of person/handle names.

Rule:
- no `PrivateClawn`/`pvtclawn` markers in preferred-surface runtime checks.

---

### B) Markers should come from one shared source-of-truth constant set
Current risk is split literals across `public-surface.ts`, tests, and artifact tests.

Rule:
- define shared marker constants for preferred-surface checks,
- forbid duplicated hardcoded marker literals in checker/test modules.

---

### C) Fallback marker remains intentionally identity-specific (bootstrap artifact)
`github blob fallback` currently validates static stub content (`PrivateClawn Research Capability Surface`).

Rule:
- keep fallback marker independent from preferred-runtime marker set,
- treat fallback as bootstrap proof only, not runtime product-state truth.

---

### D) Additive compatibility window for marker transitions
To reduce flaky failures during copy refreshes:
- allow bounded alias arrays (`currentMarker` + `legacyMarker`) in tests/checks,
- retire legacy markers once production proves current markers across two consecutive verification slices.

---

### E) Regression contract for checker semantics
Public-surface checker should distinguish:
1. unreachable (`http != 200`),
2. reachable + marker drift,
3. fully healthy.

Rule:
- marker drift remains a red status for preferred readiness,
- diagnostics must name which marker failed and which surface failed.

---

### F) Minimal update scope for next build
Scope only:
- `src/public-surface.ts` preferred marker strings,
- marker-dependent tests (`public-surface*`, `publish-assist*`, `submission-artifacts*` where preferred markers are asserted),
- no unrelated product copy changes.

## Decision matrix
| Surface | Current runtime marker | Contract status |
|---|---|---|
| public root | `ÆNS live ENS root explorer` | should be canonical |
| research capability | `Research Capability Route` | should be canonical |
| discover research | `Discover the official research capability for an ENS identity` | already canonical |
| github fallback | `PrivateClawn Research Capability Surface` | bootstrap-only; keep separate |

## Next smallest handoff
Lane E should capture applied learning for marker-contract ergonomics:
- how strict marker checks can stay useful while copy evolves,
- when to use single-marker vs alias windows,
- how to keep machine checks honest without coupling to personal branding strings.