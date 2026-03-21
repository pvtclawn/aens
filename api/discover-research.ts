import { resolveDiscoverResearchServiceResponse } from '../src/discover-research-service'

interface VercelRequestLike {
  method?: string
  query?: Record<string, string | string[] | undefined>
}

interface VercelResponseLike {
  status(code: number): VercelResponseLike
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

function pickQueryName(req: VercelRequestLike): string | null {
  const raw = req.query?.name
  if (Array.isArray(raw)) {
    return raw[0]?.trim() || null
  }
  return raw?.trim() || null
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'public, max-age=30, s-maxage=30')

  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const name = pickQueryName(req)
  if (!name) {
    return res.status(400).json({ error: 'Missing required query parameter: name' })
  }

  try {
    const payload = await resolveDiscoverResearchServiceResponse(name, new Date().toISOString())
    return res.status(200).json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return res.status(502).json({
      error: 'Failed to resolve discover-research response',
      message,
      name,
    })
  }
}
