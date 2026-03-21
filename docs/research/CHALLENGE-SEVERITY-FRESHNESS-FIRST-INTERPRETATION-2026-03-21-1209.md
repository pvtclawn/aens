# Challenge — Severity/Freshness-First Interpretation (2026-03-21 12:09 UTC)

## Target challenged
`docs/research/LEARNING-SEVERITY-FRESHNESS-OVER-WINDOW-COUNT-2026-03-21-1204.md`

## Why challenge now
Prioritizing severity + freshness is stronger than window count, but can still fail if underlying assumptions are wrong.

## Main blind spots

### 1) Fresh markers can still certify wrong facts
`marker_updated_at` can be current even if asset fields were not actually revalidated.

**Mitigation:** require explicit refresh evidence line per update:
- what was checked,
- what changed (or did not),
- timestamp of check command/output.

### 2) Severity labels can become static boilerplate
`NO-SUBMIT` may remain correct, but repeated static labels can hide subtle transitions (e.g., one asset arrives, one still missing).

**Mitigation:** split severity detail:
- `decision_severity` + concise blocker vector (`video: missing`, `log: missing/present`).

### 3) Source reference can drift from effective requirements
A static `requirements_source_ref` URL may remain unchanged while content behind it updates.

**Mitigation:** include requirement-check timestamp + short hash/summary of key requirement lines seen.

### 4) Ack markers can mislead action confidence
`reminder_ack=yes` may reflect acknowledgment without delivery timeline commitment.

**Mitigation:** separate acknowledgment from commitment:
- `reminder_ack` and optional `eta_signal` (`none`/`tentative`/`committed`).

## Red-team verdict
Severity/freshness-first interpretation is directionally right but still vulnerable to stale factual underlay, static severity semantics, and weak requirement/ack provenance.

## Stronger rule (proposed)
Keep severity/freshness primary, but require:
1. per-refresh evidence line,
2. blocker-vector detail,
3. requirement-check timestamped summary,
4. ack vs ETA distinction when coordination signals exist.
