# One-Hundred-Seventieth Slice Challenge — Task 2 Strict Diagnostics Implementation Risks (2026-03-22 11:59 UTC)

## Goal
Red-team Task 2 strict diagnostics implementation before rollout, focusing on:
1) class-template drift,
2) alias-expired wording regressions,
3) summary/artifact class-token divergence,
4) class-token visibility loss in terse outputs.

## Baseline health
- `git status -sb` clean
- `bunx tsc --noEmit` pass
- marker/proof/artifact/discover tests pass (`21 pass`)
- `bun run check-public-surface` fully green (`preferredSurfaceReady=yes`)

## Challenge findings

### 1) Shared class map can fork via local overrides in wrappers (high)
**Failure mode:** summary formatter uses central class templates, but a downstream wrapper replaces one class string for “friendlier wording.”

**Impact:** same `failureClass` yields divergent human output across commands.

**Mitigation:**
- enforce read-only exported class-template map,
- disallow per-command class text overrides,
- parity tests compare class-token-to-message mapping across all formatter entrypoints.

---

### 2) `alias-expired` can regress to ambiguous copy under pressure (high)
**Failure mode:** quick copy tweaks replace transition wording with generic phrases like “marker missing, maybe stale deploy.”

**Impact:** governance transition looks like flaky infrastructure.

**Mitigation:**
- lock `alias-expired` message template in snapshot tests,
- include mandatory transition cue (“canonical required”) in template contract,
- reject alias-expired summaries that omit policy-transition semantics.

---

### 3) Summary/artifact class tokens can diverge through recomputation (high)
**Failure mode:** summary path recomputes class from partial fields while artifact path uses preserved class from resolver.

**Impact:** identical surface result appears with different classes across outputs.

**Mitigation:**
- compute class once, propagate immutable token downstream,
- forbid class recomputation in presentation-only layers,
- add parity assertion: summary class token == artifact class token.

---

### 4) Terse summary mode can hide class tokens entirely (high)
**Failure mode:** compact/terse flags strip class identifiers, leaving only generic text.

**Impact:** legacy text parsers lose strict diagnostics signal.

**Mitigation:**
- treat class token as non-droppable summary field,
- introduce summary schema invariant requiring visible class token,
- add max-length fixtures proving class token survives truncation.

---

### 5) Multi-surface aggregation can over-normalize classes (medium-high)
**Failure mode:** aggregated report displays one blended status line and drops per-surface class distinctions.

**Impact:** high-value strict classes are masked by coarse overall status.

**Mitigation:**
- preserve per-surface class rows before aggregate verdict,
- aggregate status should reference, not replace, per-surface diagnostics,
- require at least one explicit strict class token in aggregate summary when failures exist.

---

### 6) Unknown future classes can break hard without graceful diagnostics (medium)
**Failure mode:** future class added upstream but not mapped downstream; formatter throws generic error.

**Impact:** diagnostics pipeline breaks at reporting layer.

**Mitigation:**
- keep strict unknown-class guard, but emit explicit `class-map-missing` diagnostic with offending token,
- test unknown-class behavior for controlled fail-closed + useful error output.

---

### 7) Transport warning history can be dropped when final class is non-http (medium)
**Failure mode:** retries end in marker class, earlier HTTP instability disappears.

**Impact:** operators lose context that networking contributed to outcome.

**Mitigation:**
- preserve optional `transportWarnings` trail even when primary class is non-http,
- keep primary class deterministic while retaining contextual warnings.

## Hardened rule (post-challenge)
Task 2 implementation is acceptable only if:
1. class-template mapping is centralized and immutable in all formatters,
2. alias-expired wording remains governance-transition explicit,
3. class token is computed once and parity-preserved across summary/artifact,
4. class token remains non-droppable in terse output,
5. per-surface class diagnostics survive aggregation,
6. unknown class handling fails closed with explicit mapping error context,
7. transport warning context can coexist with non-http primary classes.

## Next smallest handoff
Lane A should freeze a compact implementation plan for:
- immutable shared class-template mapping + parity guards,
- non-droppable class-token summary invariants,
- one-pass class propagation with aggregate/per-surface retention guarantees.