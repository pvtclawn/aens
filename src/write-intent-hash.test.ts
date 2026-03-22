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
    capabilityName: ' Write.PvtClawn.eth ',
    targetRecords: [
      {
        targetName: 'write.pvtclawn.eth',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/write-records/',
      },
      {
        targetName: 'pvtclawn.eth',
        key: 'aens.capabilities',
        value: '["write.pvtclawn.eth"]',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/write-records/',
    },
  }

  const second: WriteIntentPayload = {
    schemaVersion: 'aens-write-intent/v1',
    chainId: 1,
    rootName: 'pvtclawn.eth',
    capabilityName: 'write.pvtclawn.eth',
    targetRecords: [
      {
        targetName: 'pvtclawn.eth',
        key: 'aens.capabilities',
        value: '["write.pvtclawn.eth"]',
      },
      {
        targetName: 'write.pvtclawn.eth',
        key: 'aens.service',
        value: ' https://aens-nine.vercel.app/write-records ',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/write-records',
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
      value: '["write.pvtclawn.eth"]',
    },
    {
      targetName: 'write.pvtclawn.eth',
      key: 'aens.service',
      value: 'https://aens-nine.vercel.app/write-records',
    },
  ])
})

test('hashWriteIntentPayload changes when semantic intent changes', () => {
  const base: WriteIntentPayload = {
    schemaVersion: 'aens-write-intent/v1',
    chainId: 1,
    rootName: 'pvtclawn.eth',
    capabilityName: 'write.pvtclawn.eth',
    targetRecords: [
      {
        targetName: 'write.pvtclawn.eth',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/write-records',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/write-records',
    },
  }

  const changed: WriteIntentPayload = {
    ...base,
    targetRecords: [
      {
        targetName: 'write.pvtclawn.eth',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/write-records-v2',
      },
    ],
    expectedPostState: {
      ...base.expectedPostState,
      serviceUrl: 'https://aens-nine.vercel.app/write-records-v2',
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
        capabilityName: 'write.pvtclawn.eth',
        targetRecords: [
          {
            targetName: 'write.pvtclawn.eth',
            key: 'aens.service',
            value: 'https://aens-nine.vercel.app/write-records/',
          },
          {
            targetName: 'pvtclawn.eth',
            key: 'aens.capabilities',
            value: '["write.pvtclawn.eth"]',
          },
        ],
        expectedPostState: {
          authorizationStatus: 'parent-authorized',
          reasonCode: 'parent-authorized-with-service-url',
          serviceUrl: 'https://aens-nine.vercel.app/write-records/',
        },
      },
      expectedCanonicalJson: '{"capabilityName":"write.pvtclawn.eth","chainId":1,"expectedPostState":{"authorizationStatus":"parent-authorized","reasonCode":"parent-authorized-with-service-url","serviceUrl":"https://aens-nine.vercel.app/write-records"},"rootName":"pvtclawn.eth","schemaVersion":"aens-write-intent/v1","targetRecords":[{"key":"aens.capabilities","targetName":"pvtclawn.eth","value":"[\\"write.pvtclawn.eth\\"]"},{"key":"aens.service","targetName":"write.pvtclawn.eth","value":"https://aens-nine.vercel.app/write-records"}]}',
      expectedHash: '0x256c42e3ebc8b9429a8f6abfdf23c0fd936d29393e575986baa0fbdb44258dd2',
      expectedBytes: 507,
    },
    {
      name: 'missing-service-url',
      input: {
        schemaVersion: 'aens-write-intent/v1',
        chainId: 1,
        rootName: 'pvtclawn.eth',
        capabilityName: 'write.pvtclawn.eth',
        targetRecords: [
          {
            targetName: 'pvtclawn.eth',
            key: 'aens.capabilities',
            value: '["write.pvtclawn.eth"]',
          },
          {
            targetName: 'write.pvtclawn.eth',
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
      expectedCanonicalJson: '{"capabilityName":"write.pvtclawn.eth","chainId":1,"expectedPostState":{"authorizationStatus":"parent-authorized","reasonCode":"parent-authorized-without-service-url","serviceUrl":""},"rootName":"pvtclawn.eth","schemaVersion":"aens-write-intent/v1","targetRecords":[{"key":"aens.capabilities","targetName":"pvtclawn.eth","value":"[\\"write.pvtclawn.eth\\"]"},{"key":"aens.service","targetName":"write.pvtclawn.eth","value":""}]}',
      expectedHash: '0x6199fd1babec5dab40999e18c58e9ba5ae7a9f484158e8c02836e91f9cf4f13b',
      expectedBytes: 426,
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
    capabilityName: ' WRITE.PVTCLAWN.ETH ',
    targetRecords: [
      {
        targetName: 'WRITE.PVTCLAWN.ETH ',
        key: 'aens.service',
        value: 'https://aens-nine.vercel.app/write-records/',
      },
    ],
    expectedPostState: {
      authorizationStatus: 'parent-authorized',
      reasonCode: 'parent-authorized-with-service-url',
      serviceUrl: 'https://aens-nine.vercel.app/write-records/',
    },
  })

  expect(payload.rootName).toBe('pvtclawn.eth')
  expect(payload.capabilityName).toBe('write.pvtclawn.eth')
  expect(payload.targetRecords[0]).toEqual({
    targetName: 'write.pvtclawn.eth',
    key: 'aens.service',
    value: 'https://aens-nine.vercel.app/write-records',
  })
  expect(payload.expectedPostState.serviceUrl).toBe('https://aens-nine.vercel.app/write-records')
})
