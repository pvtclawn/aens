export const POLICY_BLOCKER_REASON_CODES = [
  'artifact-policy-grace-entry-invalid',
  'artifact-validator-version-grace-expired',
  'artifact-validator-version-unsupported',
  'artifact-validator-version-grace-active-nonrelease',
  'artifact-schema-version-grace-expired',
  'artifact-schema-version-unsupported',
  'artifact-schema-version-grace-active-nonrelease',
  'artifact-policy-state-unknown',
] as const

export type PolicyBlockerReasonCode = (typeof POLICY_BLOCKER_REASON_CODES)[number]

const POLICY_BLOCKER_REASON_CODE_SET = new Set<string>(POLICY_BLOCKER_REASON_CODES)

export function isPolicyBlockerReasonCode(value: string): value is PolicyBlockerReasonCode {
  return POLICY_BLOCKER_REASON_CODE_SET.has(value)
}

export function assertPolicyBlockerReasonCode(
  value: string,
  path = 'reasonCode',
): PolicyBlockerReasonCode {
  if (!isPolicyBlockerReasonCode(value)) {
    throw new Error(
      `${path} must be a registered blocker reason code (received: ${value})`,
    )
  }

  return value
}
