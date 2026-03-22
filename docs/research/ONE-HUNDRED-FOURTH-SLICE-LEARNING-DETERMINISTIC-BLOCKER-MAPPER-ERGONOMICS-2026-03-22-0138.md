# One-Hundred-Fourth Slice Learning — Deterministic Blocker-Mapper Ergonomics (2026-03-22 01:38 UTC)

## Context
The blocker-precedence mapper boundary is defined, but operator trust depends on how CI/CLI present the exact same machine decision. The key challenge is allowing wording flexibility without compromising reason-code and ordering invariants.

## Applied learning

### 1) Machine contract and human phrasing must be split explicitly
When one output string serves both automation and humans, wording tweaks can break parsers or alter perceived severity.

**Rule:** keep two layers:
- machine layer: stable reason codes + ordered lists,
- presentation layer: human text templates mapped from machine output.

Template changes must never mutate machine payload.

### 2) “Primary blocker first” must be visually enforced everywhere
Even with deterministic precedence, users still miss the root cause if summaries lead with generic context text.

**Rule:** first line in human summary should always be:
- `primaryBlockerReasonCode` (or `none`),
- axis (`validator` / `schema` / `policy`),
- release impact (`releaseEligibleByPolicy=false`).

Everything else is secondary context.

### 3) Secondary blockers should inform, not compete with primary
Long unordered blocker lists create triage paralysis.

**Rule:** show secondary blockers as ordered, bounded list:
- preserve mapper order,
- cap display count in compact mode,
- include `remainingSecondaryCount` when truncated.

This aligns readability with deterministic semantics.

### 4) CI and CLI should share one formatting adapter contract
If each surface formats independently, drift appears quickly even with shared reason constants.

**Rule:** centralize formatter primitives:
- reason-code -> default message map,
- severity badge map,
- compact/verbose rendering rules.

CI and CLI can wrap these, but not redefine them.

### 5) Unknown-state handling should be loud and unambiguous
Fail-closed unknown-state behavior is only useful if operators can instantly tell it is a taxonomy/integration problem.

**Rule:** for `artifact-policy-state-unknown`, always include:
- offending axis/state value,
- mapper version identifier,
- explicit remediation hint: `update state normalizer/mapping before release`.

### 6) Consistency checks should compare machine payload, not text snapshots
Text snapshot tests are brittle and discourage useful copy improvements.

**Rule:** correctness tests assert machine payload equivalence and ordering; text tests should verify only invariant presence (not full prose).

### 7) Gate progression context reduces overclaiming
Users may interpret “policy pass” as overall release pass.

**Rule:** append fixed progression footer to human summaries:
`policy-gate -> execution-gate -> convergence-gate`
with current gate status highlighted.

## Immediate implementation guidance
- Add shared formatter module that consumes mapper output and produces:
  - machine JSON block,
  - compact human summary with invariant line ordering.
- Add test matrix that asserts CI/CLI adapters preserve primary/secondary ordering and reason-code identity.
- Keep copy flexibility bounded to template strings; disallow ad-hoc inline blocker text in adapters.
