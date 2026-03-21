# Learning Note — Check-Completeness Tokens in No-Change Wait Loops (2026-03-21 13:09 UTC)

## Context
Evidence-line hardening v2 introduced `checks=4/4[...]` so unchanged decisions require explicit full check coverage.

## Applied learning

### 1) Completeness tokens prevent partial-check ambiguity
Without a completeness token, “unchanged” could hide skipped checks.
`checks=4/4` makes check scope explicit at decision time.

### 2) Completeness improves trust in repeated no-change states
When blockers persist, confidence depends on proving the same full baseline was re-run, not just timestamp updates.

### 3) Compact tokens scale better than verbose check logs
A single parseable token carries enough operational truth for refresh loops without bloating notes.

### 4) Completeness pairs naturally with blocker and marker linkage
`checks=4/4` is strongest when paired with:
- blocker snapshot (`video_status`, `log_status`),
- marker linkage (`marker_updated_at`),
- explicit decision.

## Reusable rule
For every no-change refresh line, require this minimum tuple:
`checks-complete + blocker-snapshot + marker-link + decision`.

## Main takeaway
Check-completeness tokens turn “unchanged” from a subjective status into a verifiable claim of full-scope revalidation.
