# One-Hundred-Fourteenth Slice Learning — Deterministic Fixture Schema/Versioning Ergonomics (2026-03-22 02:38 UTC)

## Context
The fixture schema/versioning boundary is defined, but contributor experience will determine whether strict fail-closed behavior stays healthy or devolves into bypass pressure.

## Applied learning

### 1) Strict version checks need fast, specific remediation hints
A hard fail is correct for trust boundaries, but generic messages create churn and retries.

**Rule:** every schema/version failure should include:
- failing `fixtureId` (or bundle context),
- expected vs observed version,
- exact file/path to update,
- migration checklist reference.

### 2) Fixture authoring should be deterministic by default
If fixture contributors must remember many hidden rules, accidental volatility creeps in.

**Rule:** provide a fixture template/generator that pre-fills required deterministic fields:
- `fixtureId`
- `fixtureSchemaVersion`
- `mapperSchemaVersion`
- `inputState`
- `expectedMachinePayload`

This reduces manual shape drift without loosening validation.

### 3) Migration windows must be explicit and short-lived
Dual-schema support can help transitions, but indefinite overlap weakens governance clarity.

**Rule:** when dual support is enabled, require:
- explicit deprecation deadline,
- compatibility matrix update,
- CI warning escalation as deadline approaches.

### 4) Contributor ergonomics improve with fixture-level lint before full parity run
Running full parity harness for basic fixture-shape errors wastes cycles.

**Rule:** stage checks:
1. fixture schema/version lint,
2. mapper contract compatibility,
3. adapter parity run.

Early deterministic failure keeps feedback tight.

### 5) State-encoded fixture naming materially speeds debugging
Opaque IDs force file hunting and slow incident response.

**Rule:** fixture naming pattern should encode state composition and intent,
- e.g. `validator-grace-expired_schema-active`,
- avoid timestamps/random suffixes.

### 6) Copy changes should not force fixture churn
When fixtures include prose or volatile comments, harmless docs updates create noisy diffs.

**Rule:** machine fixtures should contain machine fields only; prose stays in external notes or adapter snapshots.

### 7) Version governance should be visible in CI output, not buried in docs
Contributors often do the right thing faster when policy state is shown at failure time.

**Rule:** CI fixture-gate output should always print:
- active fixture schema versions,
- active mapper schema versions,
- current policy version,
- precise reason code for rejection.

## Immediate implementation guidance
- Add a fixture-schema lint command that runs before parity checks.
- Add deterministic error formatter for fixture version mismatches.
- Keep fail-closed semantics unchanged; improve contributor speed with templates, staged checks, and explicit governance visibility.
