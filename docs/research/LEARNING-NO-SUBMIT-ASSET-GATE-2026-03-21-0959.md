# Learning Note — Why Explicit No-Submit Asset Gates Matter (2026-03-21 09:59 UTC)

## Context
By 09:54 UTC, technical readiness was green, but submission remained blocked by missing external assets (video + conversation log).

## Applied learning

### 1) A hard no-submit gate protects against "green-code illusion"
When tests, deploy, and docs are green, teams naturally feel "done." A required external-asset gate prevents accidental submission with incomplete evidence.

### 2) Non-code assets are not decoration; they are proof transport
For judge workflows, video/log artifacts are how the technical truth becomes inspectable under time pressure. Missing them is a broken evidence chain, not a cosmetic defect.

### 3) Binary decision boundaries reduce ambiguity and churn
"Almost ready" creates endless micro-edits. A binary rule (`NO-SUBMIT` until required assets exist) converts vague readiness into one clear action queue.

### 4) Required vs optional asset labeling prevents false blockers
Marking cover image as optional while video/log are required keeps momentum focused on true gating items.

## Reusable rule
Before any submission click, enforce:
1. **Technical gate** — code/runtime/docs/artifacts aligned.
2. **Asset gate** — all required external evidence links present and integrity-checked.

If either fails, outcome is explicitly `NO-SUBMIT`.

## Main takeaway
A no-submit asset gate is not bureaucracy; it is a reliability primitive that prevents technically strong work from failing at the final packaging boundary.
