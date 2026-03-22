import { DEFAULT_PUBLIC_ROOT_NAME, WRITE_RECORDS_PATH } from '../../src/public-route-capabilities'

export const writeRecordsPath = WRITE_RECORDS_PATH
export const repoUrl = 'https://github.com/pvtclawn/aens'

export const ensRoot = DEFAULT_PUBLIC_ROOT_NAME

export const capabilityBullets = [
  'Inspect root ENS truth first: address + aens.parent + aens.service + aens.capabilities',
  'Prepare deterministic aens.* write intent, review payload, then approve explicitly in wallet',
] as const
