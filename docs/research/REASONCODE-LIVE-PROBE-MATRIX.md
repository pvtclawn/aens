# reasonCode Live Probe Matrix

Run on production before/after semantic changes.

## Required probes
1. likely authorized capability root (expected parent-authorized variant)
2. likely unauthorized or unrelated root (expected non-authorized variant)
3. likely missing-child case (expected child-not-found variant)

## For each probe capture
- request URL
- HTTP status
- `source`
- `reasonSchemaVersion`
- `reasonCode`
- legacy field checks:
  - `authorization.status`
  - `authorization.summary`
  - `endpoint.officialEndpointDeclared`

## Acceptance
- old fields remain behaviorally consistent
- reasonCode appears and is mutually exclusive per probe
- unknown/failed lookup path returns `lookup-failed` with 502 payload shape
