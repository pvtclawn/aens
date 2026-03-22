# One-Hundred-Thirty-Seventh Slice Research — Reason→Stage Ownership Mapping Boundary (2026-03-22 08:17 UTC)

## Goal
Freeze a compact boundary for Task 2 (reason-stage ownership centralization) so stage-gate outputs cannot drift across adapters.

Focus:
1) single canonical reason→stage registry,
2) fail-closed unknown-code behavior,
3) adapter parity constraints without discover/public-surface regressions.

## Current-state observations
- Stage-gate parity helpers now enforce triad presence + earliest-failing-stage alignment (`src/stage-gate-adapter-parity.ts`).
- Reason ownership is still distributed across modules (`first-seen-provenance-registry.ts`, `migration-lineage-graph.ts`, policy reason registries), with no single provenance stage-owner map.
- This leaves room for UI/CI/local adapters to reinterpret stage ownership for the same reason code.

## Boundary definition (v1)

### A) Canonical reason-stage registry is authoritative
Introduce one exported registry for stage-gate reason ownership:
- key: reason code string,
- value: stage owner (`integrity | freshness | identity`).

Rule:
- stage arbitration and adapter rendering must resolve owner from this registry,
- no adapter may hardcode stage ownership locally.

---

### B) Unknown reason codes fail closed
If a reason code is not present in the canonical registry:
- do not infer owner,
- return deterministic contract failure reason,
- mark primary blocker as contract-invalid rather than guessing stage.

Recommended deterministic contract reason:
- `fixture-provenance-stage-reason-unmapped`

---

### C) Stage ownership must be derived, not trusted
For machine payloads containing `primaryBlocker.stage` + `reasonCode`:
- compute canonical owner from registry,
- reject payload when claimed stage differs from canonical owner,
- prevent adapter-side stage override when reason ownership disagrees.

This closes the “same reason, different stage” drift across CLI/CI/UI.

---

### D) Initial ownership scope (current implemented reasons)
Minimum canonical mapping should include currently emitted provenance reasons:
- **integrity**
  - `fixture-provenance-registry-integrity-invalid`
- **freshness**
  - `fixture-provenance-registry-stale`
- **identity**
  - `fixture-provenance-id-migration-cycle-detected`
  - `fixture-provenance-id-migration-conflict`

Future reasons (duplicate/mutation/missing-record variants) must be added through the same registry before use.

---

### E) Adapter parity contract requirements
Parity checks must assert:
1. every surfaced reason code resolves in canonical registry,
2. claimed stage equals canonical owner for primary blocker,
3. unknown reason code yields deterministic fail-closed contract result,
4. compact output remains deterministic (no silent fallback labels).

---

### F) Registry versioning and diagnostics
Machine output should carry registry provenance fields:
- `reasonStageRegistryVersion`,
- `resolvedPrimaryStageOwner`,
- `stageOwnerResolutionStatus` (`resolved | unmapped | mismatch`).

This enables audit replay and cross-adapter diffing without guessing configuration state.

---

### G) Backward-compatibility boundary
- Keep existing discover/public-surface contracts unchanged.
- Scope this task to stage-gate internals and parity diagnostics.
- If needed, expose new diagnostics under non-breaking optional fields only.

## Decision matrix (owner resolution)
| Input reason code | Registry hit | Claimed stage matches owner | Outcome |
|---|---:|---:|---|
| known | yes | yes | proceed |
| known | yes | no | fail-closed (`stage-owner-mismatch`) |
| unknown | no | n/a | fail-closed (`fixture-provenance-stage-reason-unmapped`) |

## Next smallest handoff
Lane E should capture operator ergonomics for reason-stage owner diagnostics:
- how to present unmapped/mismatch states without noisy output,
- minimal remediation hints per failure class,
- compact vs verbose rendering rules that preserve deterministic triage.
