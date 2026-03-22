export type ProvenanceValidationMode = 'strict' | 'compat'

export type ProvenanceManifestStatus = 'manifest-valid' | 'manifest-invalid'

export interface ProvenanceArtifactMetadata {
  intentPayloadHash: string
  intentId: string
  validatedCommit: string
  validationMode: ProvenanceValidationMode
  status: ProvenanceManifestStatus
  releaseEligible?: boolean
}

export interface ProvenanceBindingTuple {
  intentPayloadHash: string
  intentId: string
  validatedCommit: string
}

export interface EvaluateProvenanceGateInput {
  artifact: ProvenanceArtifactMetadata
  expectedTuple: ProvenanceBindingTuple
}

export type ProvenanceGateBlockerReason =
  | 'artifact-provenance-missing'
  | 'artifact-binding-tuple-mismatch'
  | 'artifact-mode-not-release-eligible'
  | 'artifact-status-not-manifest-valid'

export interface ProvenanceGateEvaluation {
  releaseEligible: boolean
  primaryBlockerReasonCode: ProvenanceGateBlockerReason | null
  bindingTupleMatches: boolean
}

function hasValue(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0)
}

function normalize(value: string): string {
  return value.trim()
}

function hasMissingBindingTupleValue(tuple: ProvenanceBindingTuple): boolean {
  return !hasValue(tuple.intentPayloadHash)
    || !hasValue(tuple.intentId)
    || !hasValue(tuple.validatedCommit)
}

function matchesBindingTuple(input: {
  artifact: ProvenanceArtifactMetadata
  expectedTuple: ProvenanceBindingTuple
}): boolean {
  return normalize(input.artifact.intentPayloadHash) === normalize(input.expectedTuple.intentPayloadHash)
    && normalize(input.artifact.intentId) === normalize(input.expectedTuple.intentId)
    && normalize(input.artifact.validatedCommit) === normalize(input.expectedTuple.validatedCommit)
}

export function evaluateProvenanceGate(input: EvaluateProvenanceGateInput): ProvenanceGateEvaluation {
  const artifactTuple: ProvenanceBindingTuple = {
    intentPayloadHash: input.artifact.intentPayloadHash,
    intentId: input.artifact.intentId,
    validatedCommit: input.artifact.validatedCommit,
  }

  if (hasMissingBindingTupleValue(artifactTuple) || hasMissingBindingTupleValue(input.expectedTuple)) {
    return {
      releaseEligible: false,
      primaryBlockerReasonCode: 'artifact-provenance-missing',
      bindingTupleMatches: false,
    }
  }

  const bindingTupleMatches = matchesBindingTuple({
    artifact: input.artifact,
    expectedTuple: input.expectedTuple,
  })

  if (!bindingTupleMatches) {
    return {
      releaseEligible: false,
      primaryBlockerReasonCode: 'artifact-binding-tuple-mismatch',
      bindingTupleMatches,
    }
  }

  if (input.artifact.validationMode !== 'strict') {
    return {
      releaseEligible: false,
      primaryBlockerReasonCode: 'artifact-mode-not-release-eligible',
      bindingTupleMatches,
    }
  }

  if (input.artifact.status !== 'manifest-valid') {
    return {
      releaseEligible: false,
      primaryBlockerReasonCode: 'artifact-status-not-manifest-valid',
      bindingTupleMatches,
    }
  }

  return {
    releaseEligible: true,
    primaryBlockerReasonCode: null,
    bindingTupleMatches,
  }
}
