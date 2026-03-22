import { expect, test } from 'bun:test'
import {
  evaluateProvenanceGate,
  type EvaluateProvenanceGateInput,
  type ProvenanceArtifactMetadata,
} from './provenance-gate'

function buildArtifact(overrides: Partial<ProvenanceArtifactMetadata> = {}): ProvenanceArtifactMetadata {
  return {
    intentPayloadHash: '0x85d50643d2174507ac862a73e6a290acd22554dd0589e45c899409e1e7a9b70d',
    intentId: 'intent-20260322-0018-001',
    validatedCommit: '9c154be8a6b7fbcf3f1f0b88c76fc19931ee0a57',
    validationMode: 'strict',
    status: 'manifest-valid',
    ...overrides,
  }
}

function buildInput(overrides: Partial<EvaluateProvenanceGateInput> = {}): EvaluateProvenanceGateInput {
  const artifact = buildArtifact()

  return {
    artifact,
    expectedTuple: {
      intentPayloadHash: artifact.intentPayloadHash,
      intentId: artifact.intentId,
      validatedCommit: artifact.validatedCommit,
    },
    ...overrides,
  }
}

test('evaluateProvenanceGate computes release eligibility from strict predicates and ignores forged input flag', () => {
  const input = buildInput({
    artifact: buildArtifact({
      releaseEligible: false,
    }),
  })

  const result = evaluateProvenanceGate(input)

  expect(result).toEqual({
    releaseEligible: true,
    primaryBlockerReasonCode: null,
    bindingTupleMatches: true,
  })
})

test('evaluateProvenanceGate rejects tuple mismatches before mode/status checks', () => {
  const result = evaluateProvenanceGate(
    buildInput({
      artifact: buildArtifact({
        validationMode: 'compat',
        status: 'manifest-invalid',
      }),
      expectedTuple: {
        intentPayloadHash: '0x1111',
        intentId: 'intent-other',
        validatedCommit: 'deadbeef',
      },
    }),
  )

  expect(result.releaseEligible).toBe(false)
  expect(result.bindingTupleMatches).toBe(false)
  expect(result.primaryBlockerReasonCode).toBe('artifact-binding-tuple-mismatch')
})

test('evaluateProvenanceGate fails closed on missing provenance tuple values', () => {
  const result = evaluateProvenanceGate(
    buildInput({
      artifact: buildArtifact({
        intentId: ' ',
      }),
    }),
  )

  expect(result).toEqual({
    releaseEligible: false,
    primaryBlockerReasonCode: 'artifact-provenance-missing',
    bindingTupleMatches: false,
  })
})

test('evaluateProvenanceGate rejects compat mode even if forged releaseEligible=true is present', () => {
  const result = evaluateProvenanceGate(
    buildInput({
      artifact: buildArtifact({
        validationMode: 'compat',
        releaseEligible: true,
      }),
    }),
  )

  expect(result.releaseEligible).toBe(false)
  expect(result.bindingTupleMatches).toBe(true)
  expect(result.primaryBlockerReasonCode).toBe('artifact-mode-not-release-eligible')
})

test('evaluateProvenanceGate blocks manifest-invalid artifacts', () => {
  const result = evaluateProvenanceGate(
    buildInput({
      artifact: buildArtifact({
        status: 'manifest-invalid',
      }),
    }),
  )

  expect(result.releaseEligible).toBe(false)
  expect(result.bindingTupleMatches).toBe(true)
  expect(result.primaryBlockerReasonCode).toBe('artifact-status-not-manifest-valid')
})
