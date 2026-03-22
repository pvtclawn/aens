# One-Hundred-Forty-Eighth Slice Learning — Immutable Primary-Lock / Source Diagnostics Ergonomics (2026-03-22 09:31 UTC)

## Context
Task 2 boundary now freezes immutable primary-lock + source-tag parity requirements. The next risk is operator confusion from over-verbose lock metadata and inconsistent explanation ordering.

## Applied learning

### 1) Compact mode needs one explicit lock sentence, not field soup
If compact output repeats lock/source/select-reason fields without hierarchy, users miss the key guarantee.

**Rule:** compact first token for locked runs should be explicit and human-readable:
- `primaryLocked=true (immutable)`

Keep machine fields but prioritize one unambiguous lock cue.

---

### 2) Explanation order should be lock -> source -> reason -> stage context
Operators triage fastest when they understand mutability first.

**Rule:** verbose rendering order:
1. lock state,
2. primary source,
3. primary selection reason,
4. ownership status (if any),
5. stage triad context.

This prevents stage details from overshadowing lock semantics.

---

### 3) “source” labels need short glossary parity across surfaces
`ownership-contract` vs `stage-gate` can be interpreted inconsistently without a fixed micro-glossary.

**Rule:** shared short labels:
- `ownership-contract` = “ownership validation preempted stage arbitration”
- `stage-gate` = “earliest failing stage selected primary blocker”
- `none` = “no blocking failure selected”

Keep wording identical in CLI/UI/docs snippets.

---

### 4) Selection reason should be single-token deterministic in compact output
Long reason prose increases adapter drift and breaks grep-friendly diagnostics.

**Rule:** compact includes one tokenized selector:
- `primarySelectionReason=<token>`

Verbose can expand meaning, but token string must remain stable.

---

### 5) Lock violations should be framed as integrity breaches, not formatting diffs
If a downstream path mutates a locked primary, this is a contract breach.

**Rule:** parity failures for locked-primary drift should surface as
- `primary-lock-integrity-violation`

This helps teams prioritize fixes over styling discussions.

---

### 6) Stage context should be visibly secondary when primary is locked by ownership
Without secondary marking, stage rows still feel actionable-first.

**Rule:** whenever `primarySource=ownership-contract`, pair stage output with
- `stageStatusContextOnly=true`
- secondary visual marker (e.g., muted badge in UI).

---

### 7) Verbosity boundaries should avoid duplicating the same fact three times
Repeated lock/source phrases across sections create noise and increase contradiction risk.

**Rule:** each diagnostic fact appears once in canonical section; subsequent mentions should reference it, not restate with variant wording.

## Immediate implementation guidance
- Add shared formatter helper for lock/source header line (compact + verbose).
- Introduce source glossary constants used by all adapters.
- Add integrity-focused assertion labels for locked-primary mutation failures.
