# Challenge — observed-state slice risk (2026-03-19 03:36 UTC)

## Purpose
Red-team the planned observed-state slice before building it.

## Verdict
The direction is correct, but the slice can still fail if explicit state labels become a thin presentation layer over the same raw transport bundle.

## Main risks
1. **Fake state clarity**
   - explicit states exist, but the code still reasons primarily in `reachable/validJson/status`
2. **`not-declared` vs `not-attempted` confusion**
   - one is declaration state, the other is runtime/inspection-mode state
3. **`content-invalid` too coarse**
   - invalid JSON vs unusable structure still need concise reason detail
4. **Primary signal buried under detail**
   - state labels can still drown in transport fields
5. **Missing observation looks negative**
   - undeclared proof kinds can accidentally read like failures
6. **String-only tests**
   - wording may pass while state derivation remains wrong

## Required safeguards
- derive an explicit observed-state view before rendering
- distinguish `not-declared` from `not-attempted`
- preserve concise reason detail for `content-invalid`
- render `state (+ context)` rather than raw tuples
- test state derivation directly, not only final strings

## Bottom line
The next slice should be judged by whether observed proof fetches become a real state model with clear derivation rules, not by whether the section looks cleaner.
