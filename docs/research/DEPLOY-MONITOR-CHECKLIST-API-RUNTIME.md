# Deploy Monitor Checklist — API Runtime Blockers

Use this for each `/api/discover-research` production monitor pass.

## 1) Alias mapping proof
- Alias checked:
- Alias-resolved deployment id:
- Direct deployment URL checked:
- Alias == direct deployment: yes/no

## 2) Route-shape probes
- `/api/discover-research?name=...` → status / final target:
- `/api/discover-research/?name=...` → status / final target:

## 3) Runtime trace class
- Latest top-level error class (`FUNCTION_INVOCATION_FAILED`, etc):
- Fresh underlying trace class (`ERR_MODULE_NOT_FOUND`, runtime exception, timeout, other):
- Trace timestamp:

## 4) Decision + next action
- Decision state (`NO-SUBMIT` / `SUBMIT-READY`):
- Next action (`monitor` or `patch`):
- Reason:

## Cadence rule
If 1–2 consecutive monitor passes show same root-cause class and no alias/deploy change, next lane must be a minimal patch attempt.
