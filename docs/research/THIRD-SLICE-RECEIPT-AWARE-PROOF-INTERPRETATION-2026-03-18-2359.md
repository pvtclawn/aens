# Third AENS slice — receipt-aware proof interpretation (2026-03-18 23:59 UTC)

## Goal
Move AENS from generic linked-JSON awareness toward stronger trust interpretation.

## Slice
When a linked proof/receipt document is fetched, AENS now tries to recognize whether it resembles a structured receipt-like proof shape rather than treating all JSON as equal.

## What it does
- detects signed-receipt-like objects
- detects receipt lists
- distinguishes proof lists vs generic objects/arrays
- validates a small set of core receipt fields
- renders stronger trust summaries based on proof strength

## Why this matters
This keeps the project small while making the trust surface more useful:
- not full verification yet
- but no longer just "reachable JSON"

## Non-goals
- cryptographic receipt verification
- onchain anchor validation
- service invocation
- giant proof schema ecosystem

## Success criterion
AENS should now be able to say not only that linked proof material exists, but also whether it looks like a stronger receipt-like trust surface or just generic JSON.
