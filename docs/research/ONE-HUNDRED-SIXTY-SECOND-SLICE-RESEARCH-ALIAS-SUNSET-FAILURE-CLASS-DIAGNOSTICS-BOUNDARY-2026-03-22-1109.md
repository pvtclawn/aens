# One-Hundred-Sixty-Second Slice Research — Alias Sunset / Failure-Class / Diagnostics Boundary (2026-03-22 11:09 UTC)

## Goal
Freeze Task 2 boundary for marker-match precision hardening so alias expiry, strict failure classes, and machine-facing diagnostics remain trustworthy under future checker evolution.

Focus:
1) sunset-safe alias evaluation,
2) deterministic strict failure-class taxonomy,
3) diagnostics retention across checker/report outputs.

## Current-state observations
- `matchMode` is now explicit and fail-closed.
- Normalized overlap guards are active.
- Current checker outputs still summarize failure primarily as `reachable but missing expected marker` or `http <status>`, which is useful but not precise enough for post-hardening triage.
- Alias evaluation currently happens through `resolveActiveMarkerAliases`, but the boundary for diagnostics/timestamps/failure classes is not yet frozen.

## Boundary definition (v1)

### A) Alias evaluation must be time-of-match, not time-of-process
Alias governance only works if expiry is checked at the moment matching happens.

Rule:
- matcher consumes aliases only via active-alias resolution using `nowIso`/current time,
- no cached or pre-expanded alias arrays may bypass sunset checks,
- alias-match diagnostics must record evaluation time in machine-facing form.

Suggested field:
- `aliasEvaluatedAt`

---

### B) Strict failure classes must be explicit and stable
Once matching becomes stricter, operators need deterministic reasons instead of one generic “missing marker.”

Required failure classes:
- `mode-invalid`
- `alias-expired`
- `collision-blocked`
- `marker-missing`
- `http-failure`

Rule:
- each failed surface emits exactly one primary failure class,
- summaries may stay compact, but machine outputs must preserve the explicit class token.

---

### C) Alias expiry must not collapse into generic marker-missing when evidence exists
If a page matched an alias yesterday and no longer does today because the alias expired, that is materially different from a missing marker.

Rule:
- when an expired alias would otherwise have matched the body, emit `alias-expired`,
- retain the expired alias marker in diagnostics for debugging,
- do not silently downgrade expiry to plain `marker-missing`.

---

### D) Collision blocks must be surfaced as contract integrity failures, not ordinary drift
Cross-domain overlap is a contract problem, not a runtime copy mismatch.

Rule:
- normalized overlap guard failures emit `collision-blocked`,
- build/checker output should distinguish these from content drift,
- collision-blocked states should be treated as hard failures even if a looser matcher would have passed.

---

### E) Machine-facing results need structured diagnostics retention
For reproducible triage, each surface result should retain:
- `markerDomain`
- `matchMode`
- `markerMatchType`
- `matchedMarker`
- `failureClass` (when failed)
- `aliasEvaluatedAt` (when aliases are relevant)

Rule:
- compact human summaries may compress these,
- machine summaries/artifacts must not drop them.

---

### F) Summary text should remain short while mapping to structured classes
Operators still need one-line output, but not at the cost of diagnostic truth.

Rule:
- one-line summaries should map cleanly to failure class families:
  - `http-failure` -> transport/reachability issue
  - `alias-expired` -> governance/transition issue
  - `collision-blocked` -> contract integrity issue
  - `marker-missing` -> content drift issue

---

### G) Non-breaking rollout envelope
- keep current successful runtime behavior and preferred readiness logic intact,
- add `failureClass` / `aliasEvaluatedAt` / related diagnostics as additive fields,
- do not widen matcher permissiveness to preserve old wording.

## Decision matrix
| Condition | Expected class | Ready? |
|---|---|---:|
| HTTP non-200 / fetch failure | `http-failure` | no |
| Invalid or missing match mode | `mode-invalid` | no |
| Overlap guard rejects contract set | `collision-blocked` | no |
| Alias previously would match but is expired | `alias-expired` | no |
| Canonical/active alias absent | `marker-missing` | no |
| Canonical present | none (success) | yes |
| Active alias present | none (success, alias match) | yes |

## Next smallest handoff
Lane E should capture applied learning for strict-failure diagnostics ergonomics:
- how to phrase `alias-expired` without sounding flaky,
- when machine detail should stay hidden vs surfaced in summaries,
- how to keep one-line checker output terse while preserving auditability in artifacts.
