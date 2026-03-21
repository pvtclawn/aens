export type DiscoverSourceTag = 'demo-fixture' | 'live-chain-direct' | 'live-chain-via-service'

export interface DiscoverSourceView {
  raw: string
  tag: DiscoverSourceTag | null
  label: string
  warning: string | null
}

function isDiscoverSourceTag(value: string): value is DiscoverSourceTag {
  return value === 'demo-fixture'
    || value === 'live-chain-direct'
    || value === 'live-chain-via-service'
}

export function sourceTagForLookupMode(mode: string): string {
  if (mode === 'example') return 'demo-fixture'
  if (mode === 'live') return 'live-chain-direct'
  if (mode === 'service') return 'live-chain-via-service'
  return `unknown-mode:${mode}`
}

export function toDiscoverSourceView(raw: string): DiscoverSourceView {
  if (isDiscoverSourceTag(raw)) {
    if (raw === 'demo-fixture') {
      return {
        raw,
        tag: raw,
        label: 'Demo fixture',
        warning: null,
      }
    }

    if (raw === 'live-chain-direct') {
      return {
        raw,
        tag: raw,
        label: 'Live chain (direct resolver)',
        warning: null,
      }
    }

    return {
      raw,
      tag: raw,
      label: 'Live chain (service response)',
      warning: null,
    }
  }

  return {
    raw,
    tag: null,
    label: 'Unknown source (do not trust this result as live proof)',
    warning: `Unknown source tag encountered: ${raw}`,
  }
}
