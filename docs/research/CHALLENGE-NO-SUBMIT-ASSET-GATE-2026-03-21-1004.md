# Challenge — No-Submit Asset Gate (2026-03-21 10:04 UTC)

## Target challenged
`docs/research/LEARNING-NO-SUBMIT-ASSET-GATE-2026-03-21-0959.md`

## Why challenge now
The hard `NO-SUBMIT` gate is directionally correct, but can still produce false confidence if "asset present" is interpreted too loosely.

## Main blind spots

### 1) Presence without content validity
A video URL can exist but show outdated flow/order.
A conversation log can exist but omit key recovery and verification checkpoints.

**Mitigation:** split gate into two checks:
- asset presence,
- asset content-integrity (flow/order and milestone coverage).

### 2) Commit mismatch drift
Assets can be recorded against an earlier commit while form pack and bundle index point to newer state.

**Mitigation:** require one commit-pin line in final bundle note:
- `submissionCommit: <hash>`
- both video/log references must be verified against that same hash context.

### 3) Link liveness and permissions risk
Links may exist but be private, rate-limited, or geo/account restricted, causing judge access failures.

**Mitigation:** run a judge-access check from clean context:
- open links unauthenticated/incognito,
- confirm viewability without owner session.

### 4) Weak anti-tamper provenance for off-repo assets
Externally hosted video/log assets can be modified after submission.

**Mitigation:** snapshot asset metadata in repo at submission time:
- URL, timestamp, content summary, and commit hash,
- optional checksum/hash when downloadable.

## Red-team verdict
`NO-SUBMIT until assets exist` is necessary but not sufficient.
Without commit, access, and content-integrity checks, the gate can still pass on low-trust evidence.

## Stronger closure gate (proposed)
Only flip to `SUBMIT-READY` when all are true:
1. required assets present,
2. required assets content-valid,
3. required assets accessible to judges without special auth,
4. required assets pinned to same submission commit context.
