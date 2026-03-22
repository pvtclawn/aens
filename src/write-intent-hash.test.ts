import { expect, test } from 'bun:test'
import {
  buildIntentPayloadForHash,
  hashWriteIntentPayload,
  WRITE_INTENT_HASH_ALGORITHM,
  type WriteIntentPayload,
} from './write-intent-hash'

test('hashWriteIntentPayload stays stable for semantically equivalent manifests', () => {
  const first: WriteIntentPayload = {
    schemaVersion: 'aens-write-intent/v1',
    chainId: 1,
    rootName: ' PVTClawn.eth ',
    capabilityName: ' Research.PvtClawn.eth ',
    targetRecords: [
      {
        targetName: 'research.pvtclawn.eth',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/research/',
      },
      {
        targetName: 'pvtclawn.eth',
        key: 'aens.capabilities',
        value: '["research.pvtclawn.eth"]',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/research/',
    },
  }

  const second: WriteIntentPayload = {
    schemaVersion: 'aens-write-intent/v1',
    chainId: 1,
    rootName: 'pvtclawn.eth',
    capabilityName: 'research.pvtclawn.eth',
    targetRecords: [
      {
        targetName: 'pvtclawn.eth',
        key: 'aens.capabilities',
        value: '["research.pvtclawn.eth"]',
      },
      {
        targetName: 'research.pvtclawn.eth',
        key: 'aens.service',
        value: ' https://aens-nine.vercel.app/research ',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/research',
    },
  }

  const firstHash = hashWriteIntentPayload(first)
  const secondHash = hashWriteIntentPayload(second)

  expect(firstHash.intentPayloadHash).toBe(secondHash.intentPayloadHash)
  expect(firstHash.hashAlgorithm).toBe(WRITE_INTENT_HASH_ALGORITHM)
  expect(firstHash.payload.targetRecords).toEqual([
    {
      targetName: 'pvtclawn.eth',
      key: 'aens.capabilities',
      value: '["research.pvtclawn.eth"]',
    },
    {
      targetName: 'research.pvtclawn.eth',
      key: 'aens.service',
      value: 'https://aens-nine.vercel.app/research',
    },
  ])
})

test('hashWriteIntentPayload changes when semantic intent changes', () => {
  const base: WriteIntentPayload = {
    schemaVersion: 'aens-write-intent/v1',
    chainId: 1,
    rootName: 'pvtclawn.eth',
    capabilityName: 'research.pvtclawn.eth',
    targetRecords: [
      {
        targetName: 'research.pvtclawn.eth',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/research',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/research',
    },
  }

  const changed: WriteIntentPayload = {
    ...base,
    targetRecords: [
      {
        targetName: 'research.pvtclawn.eth',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/research-v2',
      },
    ],
    expectedPostState: {
      ...base.expectedPostState,
      serviceUrl: 'https://aens-nine.vercel.app/research-v2',
    },
  }

  const baseHash = hashWriteIntentPayload(base)
  const changedHash = hashWriteIntentPayload(changed)

  expect(baseHash.intentPayloadHash).not.toBe(changedHash.intentPayloadHash)
})

test('write-intent canonical vectors stay locked', () => {
  const vectors: Array<{
    name: string
    input: WriteIntentPayload
    expectedCanonicalJson: string
    expectedHash: `0x${string}`
    expectedBytes: number
  }> = [
    {
      name: 'parent-authorized-service-url',
      input: {
        schemaVersion: 'aens-write-intent/v1',
        chainId: 1,
        rootName: 'pvtclawn.eth',
        capabilityName: 'research.pvtclawn.eth',
        targetRecords: [
          {
            targetName: 'research.pvtclawn.eth',
            key: 'aens.service',
            value: 'https://aens-nine.vercel.app/research/',
          },
          {
            targetName: 'pvtclawn.eth',
            key: 'aens.capabilities',
            value: '["research.pvtclawn.eth"]',
          },
        ],
        expectedPostState: {
          authorizationStatus: 'parent-authorized',
          reasonCode: 'parent-authorized-with-service-url',
          serviceUrl: 'https://aens-nine.vercel.app/research/',
        },
      },
      expectedCanonicalJson: '{"capabilityName":"research.pvtclawn.eth","chainId":1,"expectedPostState":{"authorizationStatus":"parent-authorized","reasonCode":"parent-authorized-with-service-url","serviceUrl":"https://aens-nine.vercel.app/research"},"rootName":"pvtclawn.eth","schemaVersion":"aens-write-intent/v1","targetRecords":[{"key":"aens.capabilities","targetName":"pvtclawn.eth","value":"[\\"research.pvtclawn.eth\\"]"},{"key":"aens.service","targetName":"research.pvtclawn.eth","value":"https://aens-nine.vercel.app/research"}]}',
      expectedHash: '0xc293a36082ed7d8b42cc7ea49e34f07adc056c14ea8bed26ab9392aca6556313',
      expectedBytes: 506,
    },
    {
      name: 'missing-service-url',
      input: {
        schemaVersion: 'aens-write-intent/v1',
        chainId: 1,
        rootName: 'pvtclawn.eth',
        capabilityName: 'research.pvtclawn.eth',
        targetRecords: [
          {
            targetName: 'pvtclawn.eth',
            key: 'aens.capabilities',
            value: '["research.pvtclawn.eth"]',
          },
          {
            targetName: 'research.pvtclawn.eth',
            key: 'aens.service',
            value: '',
          },
        ],
        expectedPostState: {
          authorizationStatus: 'parent-authorized',
          reasonCode: 'parent-authorized-without-service-url',
          serviceUrl: '',
        },
      },
      expectedCanonicalJson: '{"capabilityName":"research.pvtclawn.eth","chainId":1,"expectedPostState":{"authorizationStatus":"parent-authorized","reasonCode":"parent-authorized-without-service-url","serviceUrl":""},"rootName":"pvtclawn.eth","schemaVersion":"aens-write-intent/v1","targetRecords":[{"key":"aens.capabilities","targetName":"pvtclawn.eth","value":"[\\"research.pvtclawn.eth\\"]"},{"key":"aens.service","targetName":"research.pvtclawn.eth","value":""}]}',
      expectedHash: '0x8836cd3ebaa802e4395c15abc6c56f87cc984cacae74cdb730ce9c260a033a81',
      expectedBytes: 435,
    },
  ]

  for (const vector of vectors) {
    const result = hashWriteIntentPayload(vector.input)

    expect(result.canonicalJson).toBe(vector.expectedCanonicalJson)
    expect(result.intentPayloadHash).toBe(vector.expectedHash)
    expect(result.intentPayloadByteLength).toBe(vector.expectedBytes)
  }
})

test('buildIntentPayloadForHash normalizes ENS names and URL state deterministically', () => {
  const payload = buildIntentPayloadForHash({
    schemaVersion: 'aens-write-intent/v1',
    chainId: 1,
    rootName: ' PVTCLAWN.ETH ',
    capabilityName: ' RESEARCH.PVTCLAWN.ETH ',
    targetRecords: [
      {
        targetName: 'RESEARCH.PVTCLAWN.ETH ',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/research/',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/research/',
    },
  })

  expect(payload.rootName).toBe('pvtclawn.eth')
  expect(payload.capabilityName).toBe('research.pvtclawn.eth')
  expect(payload.targetRecords[0]).toEqual({
    targetName: 'research.pvtclawn.eth',
    key: 'aens.service',
    value: 'https://aens-nine.vercel.app/research',
  })
  expect(payload.expectedPostState.serviceUrl).toBe('https://aens-nine.vercel.app/research')
})
