import { expect, test } from 'bun:test'
import {
  validateMigrationLineageGraph,
  type FixtureIdMigrationRecord,
} from './migration-lineage-graph'

test('validateMigrationLineageGraph passes for deterministic acyclic lineage graph', () => {
  const records: FixtureIdMigrationRecord[] = [
    {
      oldFixtureId: 'a',
      newFixtureId: 'b',
      migrationCommit: 'c1',
    },
    {
      oldFixtureId: 'b',
      newFixtureId: 'c',
      migrationCommit: 'c2',
    },
  ]

  const result = validateMigrationLineageGraph(records)

  expect(result.ok).toBe(true)
  expect(result.primaryBlockerReasonCode).toBeNull()
  expect(result.secondaryBlockerReasonCodes).toEqual([])
  expect(result.issues).toEqual([])
  expect(result.normalizedRecords.map((record) => `${record.oldFixtureId}->${record.newFixtureId}`)).toEqual([
    'a->b',
    'b->c',
  ])
})

test('validateMigrationLineageGraph detects deterministic migration conflicts', () => {
  const records: FixtureIdMigrationRecord[] = [
    {
      oldFixtureId: 'a',
      newFixtureId: 'b',
      migrationCommit: 'c1',
    },
    {
      oldFixtureId: 'a',
      newFixtureId: 'c',
      migrationCommit: 'c2',
    },
  ]

  const result = validateMigrationLineageGraph(records)

  expect(result.ok).toBe(false)
  expect(result.primaryBlockerReasonCode).toBe('fixture-provenance-id-migration-conflict')
  expect(result.secondaryBlockerReasonCodes).toEqual([])
  expect(result.issues.some((issue) => issue.path === 'lineage:a')).toBe(true)
})

test('validateMigrationLineageGraph detects lineage cycles with deterministic cycle reason code', () => {
  const records: FixtureIdMigrationRecord[] = [
    {
      oldFixtureId: 'a',
      newFixtureId: 'b',
      migrationCommit: 'c1',
    },
    {
      oldFixtureId: 'b',
      newFixtureId: 'c',
      migrationCommit: 'c2',
    },
    {
      oldFixtureId: 'c',
      newFixtureId: 'a',
      migrationCommit: 'c3',
    },
  ]

  const result = validateMigrationLineageGraph(records)

  expect(result.ok).toBe(false)
  expect(result.primaryBlockerReasonCode).toBe('fixture-provenance-id-migration-cycle-detected')
  expect(result.secondaryBlockerReasonCodes).toEqual([])
  expect(result.issues[0].reasonCode).toBe('fixture-provenance-id-migration-cycle-detected')
  expect(result.issues[0].lineagePath).toEqual(['a', 'b', 'c', 'a'])
})

test('validateMigrationLineageGraph enforces deterministic blocker precedence when both cycle and conflict exist', () => {
  const records: FixtureIdMigrationRecord[] = [
    {
      oldFixtureId: 'x',
      newFixtureId: 'y',
      migrationCommit: 'c1',
    },
    {
      oldFixtureId: 'y',
      newFixtureId: 'x',
      migrationCommit: 'c2',
    },
    {
      oldFixtureId: 'z',
      newFixtureId: 'p',
      migrationCommit: 'c3',
    },
    {
      oldFixtureId: 'z',
      newFixtureId: 'q',
      migrationCommit: 'c4',
    },
  ]

  const result = validateMigrationLineageGraph(records)

  expect(result.ok).toBe(false)
  expect(result.primaryBlockerReasonCode).toBe('fixture-provenance-id-migration-cycle-detected')
  expect(result.secondaryBlockerReasonCodes).toEqual(['fixture-provenance-id-migration-conflict'])
  expect(result.issues.map((issue) => issue.reasonCode)).toEqual([
    'fixture-provenance-id-migration-cycle-detected',
    'fixture-provenance-id-migration-conflict',
  ])
})
