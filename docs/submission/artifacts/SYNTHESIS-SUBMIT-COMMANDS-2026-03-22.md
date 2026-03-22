# Synthesis submit commands — ÆNS (2026-03-22)

Use this to update the draft quickly through the official API before final publish.

## Inputs you need
- `SYNTHESIS_API_KEY` (from registration)
- `PROJECT_UUID` (the existing draft project uuid)

## 1) Update draft with final payload
```bash
cd /home/clawn/.openclaw/workspace/aens
export SYNTHESIS_API_KEY='sk-synth-REDACTED'
export PROJECT_UUID='REPLACE_WITH_PROJECT_UUID'

bun run update-synthesis-project -- --project "$PROJECT_UUID" --payload docs/submission/artifacts/SYNTHESIS-PROJECT-UPDATE-PAYLOAD-2026-03-22.json
```

## 2) Optional: patch only conversation log field
```bash
cd /home/clawn/.openclaw/workspace/aens
export SYNTHESIS_API_KEY='sk-synth-REDACTED'
export PROJECT_UUID='REPLACE_WITH_PROJECT_UUID'

bun run update-synthesis-project -- --project "$PROJECT_UUID" --payload docs/submission/artifacts/SYNTHESIS-CONVERSATION-LOG-UPDATE-PAYLOAD-2026-03-22.json
```

## 3) Final pre-publish verification
```bash
cd /home/clawn/.openclaw/workspace/aens
bun run typecheck
bun test src/*.test.ts
bun run check-public-surface
```

## 4) Manual publish gate checklist
- all selected tracks visible in draft
- conversation log field populated
- submission metadata populated
- all team members self-custody complete
- final copy checked for honest wallet boundary
- then publish from Devfolio UI/API
