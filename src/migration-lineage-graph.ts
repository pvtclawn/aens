export type MigrationLineageReasonCode =
  | 'fixture-provenance-id-migration-cycle-detected'
  | 'fixture-provenance-id-migration-conflict'

export interface FixtureIdMigrationRecord {
  oldFixtureId: string
  newFixtureId: string
  migrationCommit: string
  migrationEpoch?: string
}

export interface MigrationLineageIssue {
  reasonCode: MigrationLineageReasonCode
  path: string
  message: string
  lineagePath?: string[]
}

export interface ValidateMigrationLineageResult {
  ok: boolean
  normalizedRecords: FixtureIdMigrationRecord[]
  primaryBlockerReasonCode: MigrationLineageReasonCode | null
  secondaryBlockerReasonCodes: MigrationLineageReasonCode[]
  issues: MigrationLineageIssue[]
}

const REASON_PRECEDENCE: Record<MigrationLineageReasonCode, number> = {
  'fixture-provenance-id-migration-cycle-detected': 0,
  'fixture-provenance-id-migration-conflict': 1,
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeRecord(
  record: FixtureIdMigrationRecord,
  index: number,
): FixtureIdMigrationRecord | MigrationLineageIssue {
  if (!nonEmptyString(record.oldFixtureId)) {
    return {
      reasonCode: 'fixture-provenance-id-migration-conflict',
      path: `records[${index}].oldFixtureId`,
      message: 'oldFixtureId must be a non-empty string',
    }
  }

  if (!nonEmptyString(record.newFixtureId)) {
    return {
      reasonCode: 'fixture-provenance-id-migration-conflict',
      path: `records[${index}].newFixtureId`,
      message: 'newFixtureId must be a non-empty string',
    }
  }

  if (!nonEmptyString(record.migrationCommit)) {
    return {
      reasonCode: 'fixture-provenance-id-migration-conflict',
      path: `records[${index}].migrationCommit`,
      message: 'migrationCommit must be a non-empty string',
    }
  }

  return {
    oldFixtureId: record.oldFixtureId.trim(),
    newFixtureId: record.newFixtureId.trim(),
    migrationCommit: record.migrationCommit.trim(),
    migrationEpoch: record.migrationEpoch?.trim() || undefined,
  }
}

function sortIssues(issues: MigrationLineageIssue[]): MigrationLineageIssue[] {
  return [...issues].sort((left, right) => {
    return REASON_PRECEDENCE[left.reasonCode] - REASON_PRECEDENCE[right.reasonCode]
      || left.path.localeCompare(right.path)
      || left.message.localeCompare(right.message)
  })
}

function collectReasonList(issues: MigrationLineageIssue[]): MigrationLineageReasonCode[] {
  const reasons: MigrationLineageReasonCode[] = []
  for (const issue of issues) {
    if (!reasons.includes(issue.reasonCode)) {
      reasons.push(issue.reasonCode)
    }
  }

  return reasons
}

function detectCycle(
  adjacency: Map<string, Set<string>>,
): string[] | null {
  const state = new Map<string, number>() // 0 = unvisited, 1 = visiting, 2 = visited
  const stack: string[] = []

  const nodes = Array.from(new Set([
    ...adjacency.keys(),
    ...Array.from(adjacency.values()).flatMap((targets) => Array.from(targets)),
  ])).sort((left, right) => left.localeCompare(right))

  function dfs(node: string): string[] | null {
    state.set(node, 1)
    stack.push(node)

    const targets = Array.from(adjacency.get(node) ?? []).sort((left, right) => left.localeCompare(right))
    for (const target of targets) {
      const targetState = state.get(target) ?? 0
      if (targetState === 0) {
        const cycle = dfs(target)
        if (cycle) return cycle
      } else if (targetState === 1) {
        const cycleStartIndex = stack.indexOf(target)
        return [...stack.slice(cycleStartIndex), target]
      }
    }

    stack.pop()
    state.set(node, 2)
    return null
  }

  for (const node of nodes) {
    if ((state.get(node) ?? 0) === 0) {
      const cycle = dfs(node)
      if (cycle) return cycle
    }
  }

  return null
}

export function validateMigrationLineageGraph(
  records: FixtureIdMigrationRecord[],
): ValidateMigrationLineageResult {
  const issues: MigrationLineageIssue[] = []
  const normalizedRecords: FixtureIdMigrationRecord[] = []

  for (let index = 0; index < records.length; index += 1) {
    const normalized = normalizeRecord(records[index], index)
    if ('reasonCode' in normalized) {
      issues.push(normalized)
    } else {
      normalizedRecords.push(normalized)
    }
  }

  normalizedRecords.sort((left, right) => {
    return left.oldFixtureId.localeCompare(right.oldFixtureId)
      || left.newFixtureId.localeCompare(right.newFixtureId)
      || left.migrationCommit.localeCompare(right.migrationCommit)
  })

  const adjacency = new Map<string, Set<string>>()
  const seenEdges = new Set<string>()

  for (const record of normalizedRecords) {
    const edgeKey = `${record.oldFixtureId}->${record.newFixtureId}`
    if (seenEdges.has(edgeKey)) {
      issues.push({
        reasonCode: 'fixture-provenance-id-migration-conflict',
        path: `edge:${edgeKey}`,
        message: `duplicate migration edge detected: ${edgeKey}`,
      })
      continue
    }

    seenEdges.add(edgeKey)

    const targets = adjacency.get(record.oldFixtureId) ?? new Set<string>()
    targets.add(record.newFixtureId)
    adjacency.set(record.oldFixtureId, targets)
  }

  for (const [oldFixtureId, targets] of adjacency.entries()) {
    if (targets.size > 1) {
      issues.push({
        reasonCode: 'fixture-provenance-id-migration-conflict',
        path: `lineage:${oldFixtureId}`,
        message: `oldFixtureId maps to multiple new fixture IDs: ${Array.from(targets).sort((a, b) => a.localeCompare(b)).join(', ')}`,
      })
    }
  }

  const cycle = detectCycle(adjacency)
  if (cycle) {
    issues.push({
      reasonCode: 'fixture-provenance-id-migration-cycle-detected',
      path: 'lineage:cycle',
      message: `migration lineage cycle detected: ${cycle.join(' -> ')}`,
      lineagePath: cycle,
    })
  }

  const sortedIssues = sortIssues(issues)
  const orderedReasons = collectReasonList(sortedIssues)
  const primaryBlockerReasonCode = orderedReasons[0] ?? null
  const secondaryBlockerReasonCodes = orderedReasons.slice(1)

  return {
    ok: sortedIssues.length === 0,
    normalizedRecords,
    primaryBlockerReasonCode,
    secondaryBlockerReasonCodes,
    issues: sortedIssues,
  }
}
