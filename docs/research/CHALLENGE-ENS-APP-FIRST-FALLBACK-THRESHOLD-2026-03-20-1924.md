# Challenge — ENS-App-first fallback threshold (2026-03-20 19:24 UTC)

## Purpose
Red-team the newly frozen operational default for the first live root phase:
- latest Public Resolver
- **ENS App first**
- `tools.ens.xyz` only if editability still fails

That default is probably right.
But it still needs an honest challenge around one missing boundary:
- **when exactly is failure strong enough to justify switching to the fallback surface?**

## Current truth
At challenge time:
- the first live session is still blocked on Egor + wrapped-owner wallet approvals
- the checklist now frames the root phase more honestly
- the new ENS-App-first note correctly avoids assuming a multi-surface dance too early
- however, it still leaves room for ambiguity about the switching threshold

## Weakness 1 — switching too early turns fallback into the real default again
If the operator hits one awkward ENS App moment and immediately jumps to `tools.ens.xyz`, then the new simplification collapses back into the old mental model.

Risk:
- transient ENS App lag or minor UI confusion gets overtreated as structural failure
- the operator mentally reverts to “this phase always needs multiple surfaces”
- the simplification benefit is lost before the live session has even tested the primary path fairly

Mitigation:
- do not switch surfaces on the first moment of friction alone
- require at least one concrete failed editability condition, not just impatience or temporary UI weirdness
- prefer a quick refresh/reload/reopen check before declaring ENS App unusable for the phase

## Weakness 2 — switching too late wastes time and increases stress
The opposite error also matters.
If the operator clings to ENS App too long after it is clearly not giving the needed edit path, the phase becomes slower and more stressful than necessary.

Risk:
- the session burns attention on proving the primary path should have worked
- wallet energy/attention drops before the most important writes are complete
- the fallback surface becomes psychologically more frustrating when it finally gets used

Mitigation:
- define a small threshold for “ENS App first” rather than “ENS App forever”
- once the resolver update is confirmed, if the required post-resolver edit path still is not available after a reasonable retry/reopen check, switch cleanly instead of treating fallback as defeat

## Weakness 3 — the missing threshold can hide what kind of failure actually happened
Not all failures are the same:
- temporary UI lag
- edit form not appearing
- text-record editing unavailable
- wrapped-name manager mismatch
- successful address edit but blocked `aens.*` edits

Risk:
- without naming the failure type, the operator may switch surfaces without understanding whether the issue is:
  - general ENS App failure
  - text-record-specific friction
  - wrapped-name-specific limitation
- that weakens the eventual learning value of the first live session

Mitigation:
- if switching becomes necessary, name the failure class explicitly in notes:
  - `editability missing after resolver update`
  - `text-record path unavailable`
  - `wrapped-name manager friction`
- do not just record “ENS App weirdness`

## Weakness 4 — fallback can still sound like failure instead of contingency
Even with the new note, a human can still feel that needing `tools.ens.xyz` means the default path “failed.”

Risk:
- that emotional framing can cause rushed decisions
- fallback use may feel like deviation instead of controlled contingency
- the session can become narratively messier than it is technically

Mitigation:
- keep the language neutral: fallback is contingency, not defeat
- if the threshold is met, switch cleanly and proceed
- the important thing is to preserve accurate record-setting and proof capture, not to “win” the ENS App path

## Bottom line
`ENS App first` is the right default only if the session also has a sane fallback threshold.
Without that, the operator can either:
- switch too early and lose the simplification
- or switch too late and waste focus

## Best next move
If this edge gets one more tiny planning pass, it should freeze a minimal threshold like:
1. confirm resolver tx landed
2. attempt ENS App record editing on the updated resolver
3. if required editability still is not available after one reasonable retry/reopen check, switch to `tools.ens.xyz`
4. record the exact failure class rather than vague `ENS App weirdness`

That would tighten the first live session materially without expanding the model.
