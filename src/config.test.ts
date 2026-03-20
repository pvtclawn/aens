import { expect, test } from 'bun:test'
import { DEFAULT_RPC_URLS, getRpcUrls, getRpcUrlsFromSources } from './config'

test('getRpcUrls returns an explicit input RPC without defaults', () => {
  expect(getRpcUrls('https://example.com')).toEqual(['https://example.com'])
})

test('getRpcUrlsFromSources merges env RPCs with defaults and de-duplicates them', () => {
  expect(
    getRpcUrlsFromSources({
      envRpcUrls: `https://example.com, ${DEFAULT_RPC_URLS[0]}, https://example.com`,
      envRpcUrl: DEFAULT_RPC_URLS[1],
    }),
  ).toEqual([
    'https://example.com',
    DEFAULT_RPC_URLS[0],
    DEFAULT_RPC_URLS[1],
    DEFAULT_RPC_URLS[2],
    DEFAULT_RPC_URLS[3],
  ])
})
