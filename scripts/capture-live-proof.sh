#!/usr/bin/env bash
set -euo pipefail

label="${1:-capture}"
timestamp="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
safe_label="$(printf '%s' "$label" | tr ' ' '-' | tr -cd '[:alnum:]-_')"
out_dir="${AENS_PROOF_DIR:-docs/proof/live-session}"
out_file="${out_dir}/${timestamp}--${safe_label}.md"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p "$out_dir"
cd "$repo_root"

commit="$(git rev-parse HEAD)"
overall_status=0

capture_command() {
  local title="$1"
  shift
  local status=0
  local output

  if ! output="$("$@" 2>&1)"; then
    status=$?
    overall_status=$status
  fi

  {
    printf '## %s\n\n' "$title"
    printf -- '- Exit code: `%s`\n\n' "$status"
    printf '```text\n%s\n```\n\n' "$output"
  } >> "$out_file"
}

{
  printf '# ÆNS live proof capture — %s\n\n' "$label"
  printf -- '- Captured: `%s`\n' "$timestamp"
  printf -- '- Repo commit: `%s`\n' "$commit"
  printf -- '- Working directory: `%s`\n\n' "$repo_root"
} > "$out_file"

capture_command 'bun run inspect pvtclawn.eth' bun run inspect pvtclawn.eth
capture_command 'bun run inspect research.pvtclawn.eth' bun run inspect research.pvtclawn.eth

echo "$out_file"
exit "$overall_status"
