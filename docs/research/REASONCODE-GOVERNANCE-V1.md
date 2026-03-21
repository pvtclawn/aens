# reasonCode Governance v1

## Taxonomy budget
- `reasonSchemaVersion: v1`
- Max reason categories in v1 (excluding `lookup-failed`): **4**
- Current categories:
  - `child-not-found`
  - `child-found-not-authorized`
  - `parent-authorized-without-service-url`
  - `parent-authorized-with-service-url`

## Version bump trigger
Bump `reasonSchemaVersion` when any of these happen:
1. New reason category is added beyond budget.
2. Meaning/precedence of an existing reason changes.
3. Existing reason is removed or merged.

## Change discipline
- Every taxonomy change must include:
  - test updates proving exclusivity/precedence,
  - short changelog note in research docs,
  - live probe matrix verification.
