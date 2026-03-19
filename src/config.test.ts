import { afterEach, expect, test } from 'bun:test'
import { DEFAULT_RPC_URLS, getRpcUrls } from './config'

afterEach(() => {
  delete process.env.AENS_RPC_URL
  delete process.env.AENS_RPC_URLS
})

test('getRpcUrls returns an explicit input RPC without defaults', () => {
  expect(getRpcUrls('https://example.com')).toEqual(['https://example.com'])
})

test('getRpcUrls merges env RPCs with defaults and de-duplicates them', () => {
  process.env.AENS_RPC_URLS = `https://example.com, ${DEFAULT_RPC_URLS[0]}, https://example.com`
  process.env.AENS_RPC_URL = DEFAULT_RPC_URLS[1]

  expect(getRpcUrls()).toEqual([
    'https://example.com',
    DEFAULT_RPC_URLS[0],
    DEFAULT_RPC_URLS[1],
    DEFAULT_RPC_URLS[2],
    DEFAULT_RPC_URLS[3],
  ])
})
