# Challenge — Final-Mile Submission Packaging Rule (2026-03-21 09:34 UTC)

## Target challenged
`docs/research/LEARNING-FINAL-MILE-SUBMISSION-PACKAGING-RISK-2026-03-21-0929.md`

## Why challenge now
The rule correctly elevates non-code submission assets, but it can still create false confidence if assets exist but are weakly verifiable.

## Main blind spots

### 1) Presence bias: "link exists" can still be low-truth
A video URL can exist while showing an outdated flow or old deployment state.
A conversation log can exist while omitting critical steps used for final claims.

**Mitigation:** add a content-integrity gate, not just presence checks:
- video must visibly demonstrate the current judge flow order,
- log must include key recovery/verification checkpoints tied to current commits.

### 2) Drift between packaged links and current repo truth
Final form text can point to resources generated before latest docs/artifact alignment.

**Mitigation:** add one "link freshness" step before submit:
- open each linked resource and confirm it reflects current form-pack claims,
- confirm linked artifact paths correspond to latest committed files.

### 3) Weak provenance for externally hosted assets
Video and logs are often hosted outside repo and can be replaced or edited without trace.

**Mitigation:** pin provenance in submission docs:
- record upload timestamp + host URL + commit hash in a final bundle note,
- keep a repo-stored index file mapping every submitted link to the commit used for submission.

### 4) Human readability risk for judges under time pressure
Even accurate artifacts can be ignored if judges cannot quickly map "what to watch/read first."

**Mitigation:** include a tiny 30-second judge entry map in form pack:
1. one sentence user problem,
2. one deterministic artifact,
3. one live surface,
4. one proof boundary sentence.

## Red-team verdict
The packaging rule is directionally right but still vulnerable to **presence-only checks**, **link drift**, and **off-repo provenance gaps**.

## Stronger closure rule (proposed)
Do not mark final submission-ready unless all hold:
1. required assets present,
2. required assets content-verified against current flow,
3. submitted links pinned to current commit context,
4. judge entry map included for fast human comprehension.
