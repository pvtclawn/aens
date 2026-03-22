# One-Hundred-Fifty-Seventh Slice Research — Marker-Match Precision Boundary (2026-03-22 10:33 UTC)

## Goal
Freeze the precision boundary for marker matching after the verified alias-collision leak, so runtime/fallback domain separation is semantically enforceable (not just structurally declared).

## Trigger
Lane C verification (`24c6de9`) proved domain metadata + bounded aliases work, but also exposed this collision:
- runtime research alias: `PrivateClawn Research Capability`
- fallback canonical marker: `PrivateClawn Research Capability Surface`
- substring matching incorrectly reports runtime alias success.

## Boundary definition (v1)

### A) Matching mode must be explicit per marker contract
Every marker contract should declare a match mode:
- `exact` (full string equality)
- `token-boundary` (word-boundary safe)
- `contains` (only when explicitly justified)

Rule:
- preferred-runtime and fallback contracts default to `exact` unless an exception is documented.
- `contains` cannot be the default for cross-domain markers.

---

### B) Alias strings must pass cross-domain non-overlap checks
Alias governance is incomplete without collision checks against other domains.

Rule:
- on load/test, reject aliases that are substrings/supersets of canonical markers in other domains.
- at minimum, reject runtime aliases that can match bootstrap fallback canonical content.

---

### C) Route-specific marker uniqueness must be asserted
Markers should identify one monitored surface, not a category of pages.

Rule:
- each preferred-runtime canonical marker must be unique across preferred pages and fallback content.
- add uniqueness tests over canonical+active alias sets.

---

### D) Checker should preserve match provenance in outputs
For debugging and trust, machine outputs must reveal why a page passed.

Required diagnostics:
- `markerMatchType` (`canonical|alias|none`)
- `matchedMarker`
- `markerDomain`
- `matchMode`

This keeps drift triage deterministic and auditable.

---

### E) Alias policy should prefer role-semantic aliases over identity aliases
Identity-coupled aliases are high-collision and low-longevity.

Rule:
- if alias is needed, prioritize route-semantic wording (e.g., page title variants),
- demote/remove personal-brand aliases first in cleanup sequence.

---

### F) Sunset enforcement needs behavior, not just metadata
Sunset fields alone do not prevent stale alias matching in legacy paths.

Rule:
- active-alias resolution must be the only alias source consumed by matcher paths,
- tests must include post-sunset negative assertions for each alias.

---

### G) Minimal hardening scope for next build
Focus only on precision hardening (not broad copy churn):
1. add `matchMode` support in marker contract + matcher,
2. enforce cross-domain alias non-overlap checks,
3. replace risky identity alias with collision-safe route-semantic alias where required,
4. lock behavior via tests.

## Decision matrix
| Scenario | Expected result |
|---|---|
| canonical exact marker present | `canonical` pass |
| active alias present, non-overlapping | `alias` pass |
| fallback canonical present against runtime target | `none` (must fail) |
| alias past sunset date | `none` (must fail) |
| runtime/fallback overlap detected in contract set | build/test hard fail |

## Next smallest handoff
Lane E should capture applied learning for precision ergonomics:
- when `exact` vs `token-boundary` is practical,
- how to keep copy flexibility without relaxing matcher integrity,
- minimal operator messaging when matches fail due strict precision rules.