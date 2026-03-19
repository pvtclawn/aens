import type { AensResolvedProfile } from './profile'

export interface FetchResponseLike {
  ok: boolean
  status: number
  headers?: { get(name: string): string | null }
  text(): Promise<string>
}

export type FetchLike = (url: string) => Promise<FetchResponseLike>

export type LinkedRecordShape =
  | 'battle-receipt'
  | 'receipt-list'
  | 'proof-list'
  | 'generic-array'
  | 'generic-object'
  | 'invalid'
  | 'missing'

export type LinkedRecordStrength = 'signed-receipt' | 'receipt-like' | 'generic' | 'none'

export interface LinkedRecordSummary {
  kind: 'proofs' | 'receipts'
  url: string
  reachable: boolean
  status: number | null
  validJson: boolean
  shape: LinkedRecordShape
  itemCount: number | null
  keyCount: number | null
  proofStrength: LinkedRecordStrength
  coreFieldsPresent: string[]
  coreFieldsMissing: string[]
  summary: string
}

function objectKeys(value: unknown): string[] {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? Object.keys(value as Record<string, unknown>)
    : []
}

function buildFieldSets(input: {
  topLevel: Record<string, unknown>
  payload: Record<string, unknown>
}) {
  const topLevelRequired = ['payload', 'signature', 'receiptHash']
  const payloadRequired = ['agentId', 'operator', 'sessionId', 'authorityHash', 'artifactRoot']

  const coreFieldsPresent = [
    ...topLevelRequired.filter((field) => field in input.topLevel),
    ...payloadRequired
      .filter((field) => field in input.payload)
      .map((field) => `payload.${field}`),
  ]

  const coreFieldsMissing = [
    ...topLevelRequired.filter((field) => !(field in input.topLevel)),
    ...payloadRequired
      .filter((field) => !(field in input.payload))
      .map((field) => `payload.${field}`),
  ]

  return { coreFieldsPresent, coreFieldsMissing }
}

function summarizeSignedReceiptLike(
  kind: 'proofs' | 'receipts',
  url: string,
  status: number,
  value: Record<string, unknown>,
): LinkedRecordSummary {
  const payload = value.payload
  const payloadRecord = payload !== null && typeof payload === 'object' && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {}

  const { coreFieldsPresent, coreFieldsMissing } = buildFieldSets({
    topLevel: value,
    payload: payloadRecord,
  })

  const proofStrength: LinkedRecordStrength = coreFieldsMissing.length === 0
    ? 'signed-receipt'
    : 'receipt-like'

  return {
    kind,
    url,
    reachable: true,
    status,
    validJson: true,
    shape: 'battle-receipt',
    itemCount: null,
    keyCount: objectKeys(value).length,
    proofStrength,
    coreFieldsPresent,
    coreFieldsMissing,
    summary: proofStrength === 'signed-receipt'
      ? `${kind} document matches a signed receipt-like object with all core fields present`
      : `${kind} document resembles a signed receipt but is missing ${coreFieldsMissing.length} core field(s)`,
  }
}

function summarizeReceiptList(
  kind: 'proofs' | 'receipts',
  url: string,
  status: number,
  entries: unknown[],
  keyCount: number | null,
): LinkedRecordSummary {
  const first = entries[0]
  const firstRecord = first !== null && typeof first === 'object' && !Array.isArray(first)
    ? first as Record<string, unknown>
    : {}
  const payload = firstRecord.payload
  const payloadRecord = payload !== null && typeof payload === 'object' && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {}

  const { coreFieldsPresent, coreFieldsMissing } = buildFieldSets({
    topLevel: firstRecord,
    payload: payloadRecord,
  })

  const hasReceiptSignals = coreFieldsPresent.length > 0
  const proofStrength: LinkedRecordStrength = hasReceiptSignals
    ? (coreFieldsMissing.length === 0 ? 'signed-receipt' : 'receipt-like')
    : 'generic'

  return {
    kind,
    url,
    reachable: true,
    status,
    validJson: true,
    shape: 'receipt-list',
    itemCount: entries.length,
    keyCount,
    proofStrength,
    coreFieldsPresent,
    coreFieldsMissing,
    summary: hasReceiptSignals
      ? `${kind} document is a list of ${entries.length} receipt-like item(s)`
      : `${kind} document is a JSON list with ${entries.length} item(s) but no clear receipt structure`,
  }
}

function summarizeJson(kind: 'proofs' | 'receipts', url: string, status: number, value: unknown): LinkedRecordSummary {
  if (Array.isArray(value)) {
    const looksLikeReceiptList = value.some((entry) => {
      if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
        return false
      }
      const record = entry as Record<string, unknown>
      return 'receiptHash' in record || 'signature' in record || 'payload' in record
    })

    if (looksLikeReceiptList) {
      return summarizeReceiptList(kind, url, status, value, null)
    }

    return {
      kind,
      url,
      reachable: true,
      status,
      validJson: true,
      shape: 'generic-array',
      itemCount: value.length,
      keyCount: null,
      proofStrength: 'generic',
      coreFieldsPresent: [],
      coreFieldsMissing: [],
      summary: `${kind} document is a JSON array with ${value.length} item(s)`,
    }
  }

  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>

    const looksLikeSignedReceipt = 'receiptHash' in record || 'signature' in record || 'payload' in record
    if (looksLikeSignedReceipt) {
      return summarizeSignedReceiptLike(kind, url, status, record)
    }

    const receipts = Array.isArray(record.receipts) ? record.receipts : null
    if (receipts) {
      return summarizeReceiptList(kind, url, status, receipts, objectKeys(record).length)
    }

    const proofs = Array.isArray(record.proofs) ? record.proofs : null
    if (proofs) {
      return {
        kind,
        url,
        reachable: true,
        status,
        validJson: true,
        shape: 'proof-list',
        itemCount: proofs.length,
        keyCount: objectKeys(record).length,
        proofStrength: 'generic',
        coreFieldsPresent: [],
        coreFieldsMissing: [],
        summary: `${kind} document is a JSON object with ${objectKeys(record).length} key(s) and ${proofs.length} listed proof item(s)`,
      }
    }

    return {
      kind,
      url,
      reachable: true,
      status,
      validJson: true,
      shape: 'generic-object',
      itemCount: null,
      keyCount: objectKeys(record).length,
      proofStrength: 'generic',
      coreFieldsPresent: [],
      coreFieldsMissing: [],
      summary: `${kind} document is a JSON object with ${objectKeys(record).length} key(s)`,
    }
  }

  return {
    kind,
    url,
    reachable: true,
    status,
    validJson: false,
    shape: 'invalid',
    itemCount: null,
    keyCount: null,
    proofStrength: 'none',
    coreFieldsPresent: [],
    coreFieldsMissing: [],
    summary: `${kind} document is reachable but not a usable JSON object/array`,
  }
}

function unreachableSummary(kind: 'proofs' | 'receipts', url: string, status: number | null, reason: string): LinkedRecordSummary {
  return {
    kind,
    url,
    reachable: false,
    status,
    validJson: false,
    shape: 'missing',
    itemCount: null,
    keyCount: null,
    proofStrength: 'none',
    coreFieldsPresent: [],
    coreFieldsMissing: [],
    summary: `${kind} document is not currently usable: ${reason}`,
  }
}

async function fetchLinkedRecord(
  kind: 'proofs' | 'receipts',
  url: string | null | undefined,
  fetcher: FetchLike,
): Promise<LinkedRecordSummary | null> {
  if (!url) {
    return null
  }

  try {
    const response = await fetcher(url)
    if (!response.ok) {
      return unreachableSummary(kind, url, response.status, `http ${response.status}`)
    }

    const text = await response.text()
    try {
      const parsed = JSON.parse(text) as unknown
      return summarizeJson(kind, url, response.status, parsed)
    } catch {
      return {
        kind,
        url,
        reachable: true,
        status: response.status,
        validJson: false,
        shape: 'invalid',
        itemCount: null,
        keyCount: null,
        proofStrength: 'none',
        coreFieldsPresent: [],
        coreFieldsMissing: [],
        summary: `${kind} document is reachable but not valid JSON`,
      }
    }
  } catch (error) {
    return unreachableSummary(kind, url, null, error instanceof Error ? error.message : 'unknown fetch error')
  }
}

export async function fetchLinkedRecords(
  profile: AensResolvedProfile,
  fetcher: FetchLike = async (url) => {
    const response = await fetch(url)
    return {
      ok: response.ok,
      status: response.status,
      headers: response.headers,
      text: () => response.text(),
    }
  },
): Promise<LinkedRecordSummary[]> {
  const summaries = await Promise.all([
    fetchLinkedRecord('proofs', profile.records.proofsUrl, fetcher),
    fetchLinkedRecord('receipts', profile.records.receiptsUrl, fetcher),
  ])

  return summaries.filter((entry): entry is LinkedRecordSummary => entry !== null)
}
