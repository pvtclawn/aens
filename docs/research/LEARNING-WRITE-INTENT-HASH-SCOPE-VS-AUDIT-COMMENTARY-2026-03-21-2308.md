# Learning — Write-Intent Hash Scope vs Audit-Only Commentary (2026-03-21 23:08 UTC)

## Context
The v1 write-intent manifest boundary is now defined. The practical confusion risk is not schema shape, but where teams blur:
- cryptographic commitment scope, and
- operator/audit narration scope.

## Applied learning

### 1) Hash scope must encode *intent semantics*, not operator prose
If freeform notes are in hash scope, harmless wording edits create false mismatches.
If core intent fields are out of hash scope, materially different writes can share a digest.

**Rule:** hash scope includes only deterministic intent payload fields:
- `schemaVersion`, `chainId`, `rootName`, `capabilityName`,
- normalized+sorted `targetRecords`,
- `expectedPostState`.

### 2) Audit commentary should be immutable-by-reference, not hash-coupled
Operators still need rich context (`why now`, approvals, caveats), but that should not invalidate prior commitment checks.

**Rule:** keep commentary outside `intentPayloadHash`, but store it adjacent with a stable reference:
- `commentaryRef` (path/URI),
- `commentaryDigest` (optional separate hash),
- `commentaryUpdatedAt`.

This preserves auditability without destabilizing intent matching.

### 3) Record-list ordering is a hidden entropy source
Two equivalent manifests with different record order should not produce different payload commitments.

**Rule:** canonicalize and sort by `(targetName, key, value)` before hash computation; verify canonicalization in tests.

### 4) “Expected post-state” must be semantic, not UI-textual
Binding hash scope to rendered copy (“looks authorized”) is brittle and locale-dependent.

**Rule:** include semantic expectation keys (`authorizationStatus`, `reasonCode`, `serviceUrl`) instead of prose strings.

### 5) Anti-confusion operator guidance needs a three-line contract
Most mistakes happen when users assume “manifest exists” means “execution done.”

**Rule:** every runbook/report should repeat:
1. intent hash proves planned write payload,
2. tx evidence proves execution attempt,
3. post-write chain read proves actual convergence.

## Immediate implementation guidance
- Add one helper: `buildIntentPayloadForHash(manifest)` that strips audit-only fields explicitly.
- Add one validator rule: reject manifests missing any hash-scope field even when commentary is rich.
- Add one report line template: `intentHash -> txRefs -> postStateVerdict` to keep operators anchored.
