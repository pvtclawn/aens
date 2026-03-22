export const researchPath = '/research/'
export const discoverResearchPath = '/discover-research/'
export const writeRecordsPath = '/write-records/'
export const repoUrl = 'https://github.com/pvtclawn/aens'

// Generic defaults (no project-identity hardcoding in runtime UX)
export const ensRoot = 'vitalik.eth'
export const ensResearch = 'research.vitalik.eth'
export const agentId = '1391'

export const capabilityBullets = [
  'Resolve ENS root + capability records directly from chain',
  'Discover official research endpoint under parent authorization',
  'Write aens records from wallet UI',
] as const

export const notYetBullets = [
  'runtime auth',
  'payments',
  'full production hardening',
] as const
