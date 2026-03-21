# Learning — Validator Ergonomics: Strict Fail-Closed vs Operator Usability (2026-03-21 23:38 UTC)

## Context
The payload/envelope split boundary is now frozen. The next implementation risk is human-facing ergonomics: strict validation can protect trust boundaries, but poor error UX can push operators into bypass behavior.

## Applied learning

### 1) Fail-closed and user-hostile are not the same thing
A validator must reject unsafe/ambiguous manifests, but rejection without precise diagnosis increases copy-paste churn and accidental drift.

**Rule:** keep strict rejection semantics, but return structured actionable errors:
- `reasonCode` (machine)
- `path` (field pointer)
- `hint` (repair guidance)

Example:
- `manifest-payload-invalid`
- `path=intentPayload.targetRecords[1].key`
- `hint=record key must be non-empty string`

### 2) Error ordering affects operator success rate
When many fields fail, random error order makes retries noisy and non-deterministic.

**Rule:** emit deterministic error ordering:
1. structure/shell errors,
2. payload required-field/type errors,
3. envelope required-field/type errors,
4. canonicalization violations,
5. hash mismatch (only after payload validity).

This prevents hash mismatch noise from masking root schema failures.

### 3) Strict mode should still expose “why hash changed” diffs
Operators need to know whether failure is semantic drift or formatting drift.

**Rule:** on hash mismatch, include concise diff context:
- normalized expected payload hash input summary,
- normalized observed payload hash input summary,
- first divergent path.

No full secret dump required; just enough to repair quickly.

### 4) Envelope leniency should be explicit, not accidental
If envelope optional refs are tolerated silently, different tools may diverge in behavior.

**Rule:** support two validator modes with explicit declaration:
- `strict`: unknown envelope keys rejected,
- `compat`: unknown envelope keys warned (not fatal).

Default for CI/governance should remain `strict`.

### 5) Operator confidence improves with preflight auto-normalization preview
For common repairable issues (whitespace/case/trailing slash), hard-fail without preview can feel arbitrary.

**Rule:** provide preflight preview command:
- show normalized `intentPayload`,
- show resulting `intentPayloadHash`,
- clearly state this is preview, not acceptance.

This reduces retries while keeping final validator strict.

### 6) Keep “converged” language locked behind verification layer
Users may treat `manifest valid` as equivalent to `state converged`.

**Rule:** validator output must explicitly separate states:
- `manifest-valid` (schema/hash integrity)
- `execution-verified` (tx evidence)
- `poststate-converged` (chain semantic match)

Only the third justifies completion claims.

## Immediate implementation guidance
- Add a typed `ValidationIssue[]` contract with `{reasonCode, path, severity, hint}`.
- Add deterministic issue sorting before output.
- Add preflight normalize/hash preview helper for operator ergonomics.
- Keep CI default `strict`; allow optional `compat` mode only for local migration periods.
