# Learning Note — Tiny Machine Checks over Heavy Policy Stacks (2026-03-21 17:59 UTC)

## Context
The project hardened privileged-probe governance using markdown procedures/checklists plus compact validation rules, without introducing a full policy engine.

## Applied learning

### 1) Lightweight checks beat heavyweight frameworks at this stage
A small validator/checklist with strict required fields catches most governance failures earlier than process docs alone, with far less operational overhead than a full policy platform.

### 2) Enforceability comes from a few high-leverage invariants
The highest-value controls were simple and machine-checkable:
- required provenance refs,
- timestamp format + ordering constraints,
- unique window identity fields,
- explicit closeout/inertness markers.

### 3) Documentation becomes operational when constraints are executable
Policy text by itself is advisory. Once represented as pass/fail assertions, docs turn into runtime process controls.

### 4) Minimal tooling preserves iteration speed
Heavy governance tooling can slow product work. Tiny checks let the team keep shipping while preventing obvious control drift.

## Reusable rule
When hardening process around a live service:
1. identify a minimal invariant set,
2. make each invariant machine-checkable,
3. keep validator output short and actionable,
4. expand only when real gaps appear.

## Main takeaway
For small teams and fast-moving agent products, governance quality scales best from compact executable invariants—not from prematurely adopting heavyweight policy stacks.
