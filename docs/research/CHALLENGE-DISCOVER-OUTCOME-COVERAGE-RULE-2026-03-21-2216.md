# Challenge — Discover Outcome-Coverage Rule (2026-03-21 22:16 UTC)

## Goal
Red-team the new outcome-based discover demo guidance before implementation, focusing on three likely failure classes: fixture drift, taxonomy overfit, and operator confusion.

## Baseline recheck
- `git status -sb` clean.
- `bunx tsc --noEmit` pass.
- Targeted discover semantics tests pass (`13 pass` across discover/reason/failure suites).

## Challenge findings

### 1) Fixture drift risk (high)
**Failure mode:** discover-specific fixtures can silently diverge from live service semantics while still passing local example checks.
- Example: fixture says `child-not-found`, live endpoint evolves logic and starts returning `child-found-not-authorized` for the same shape.
- Result: demos become stable-but-wrong and reduce trust.

**Mitigation:** add a drift guard that compares each deterministic discover fixture to an explicit expected reason-code snapshot file versioned with tests.

---

### 2) Taxonomy overfit risk (high)
**Failure mode:** forcing one canonical fixture per outcome can overfit to today’s reason taxonomy and make evolution painful.
- If reason taxonomy expands, old fixture assumptions can become too rigid or misleading.
- Outcome labels may become implementation-coupled instead of user-meaningful.

**Mitigation:** keep outcome labels user-level (`authorized`, `partial`, `missing`, `failure`) and map them to reason codes through a versioned mapping table (not hardcoded docs prose).

---

### 3) Operator confusion risk (medium-high)
**Failure mode:** two fixture layers (authority + discover) can confuse operators about which command to run for which proof claim.
- Wrong command path can look like product failure when it is actually surface mismatch.

**Mitigation:** add a one-screen command matrix in docs:
- authority claims → authority fixtures/commands,
- discover claims → discover fixtures/commands,
- failure contract claims → gated probe command only.

---

### 4) Failure-path misuse risk (medium)
**Failure mode:** treating timeout/failure shape as just another fixture may normalize privileged probe paths and blur safety boundaries.

**Mitigation:** keep failure-shape verification explicitly non-default, with mandatory “probe disabled by default” confirmation line in every demo script/checklist.

---

### 5) Demo confidence inflation risk (medium)
**Failure mode:** deterministic multi-example demos may be interpreted as proof of live ecosystem coverage.

**Mitigation:** enforce paired demo rule: each deterministic fixture demo must be followed by one live query example and explicit “fixture vs live” boundary line.

## Hardened rule (post-challenge)
Outcome-based discover coverage is valid only if all five constraints hold:
1. fixture-to-expected snapshot drift checks,
2. versioned outcome→reason mapping,
3. explicit authority-vs-discover command matrix,
4. default-off failure-probe safety clause,
5. deterministic + live paired demonstration rule.

## Next smallest follow-up
Before build implementation, freeze one compact plan slice that adds:
- outcome→reason mapping artifact,
- command matrix block for operators,
- paired demo acceptance criteria in discover docs/tests.
