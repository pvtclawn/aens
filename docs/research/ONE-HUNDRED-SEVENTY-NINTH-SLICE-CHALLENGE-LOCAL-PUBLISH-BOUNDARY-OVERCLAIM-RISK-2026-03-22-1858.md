# One-Hundred-Seventy-Ninth Slice Challenge — Local Publish Boundary Overclaim Risk (2026-03-22 18:58 UTC)

## Context
ÆNS currently has meaningful local-only work in `main...origin/main [ahead 2]`. The immediate risk is no longer misunderstanding the abstract boundary; it is operational overclaim in the period between local commit, remote publish, and verified deployment.

## Main risks

### 1) Heartbeat summaries can accidentally imply public completion
Even when wording is careful, compact status lines tend to compress nuance.

**Failure mode:**
- `fixed`, `done`, or `shipped` is read as publicly available,
- while the underlying state is only local commit truth.

**Mitigation:**
- require `local-only`, `ahead of origin`, or `not yet deployed` wording whenever remote/deploy proof is absent,
- reserve `done` for lane completion, not for public availability.

---

### 2) Wallet-flow sequencing can push users into stale or mismatched surfaces
If a write flow is described right after a local app fix, humans infer the UI they see is the intended final surface.

**Failure mode:**
- user signs ENS writes against an old live page,
- or signs based on instructions derived from code that is not yet what the public page shows.

**Mitigation:**
- keep wallet-signature steps explicitly blocked on publish/deploy confirmation,
- if local/manual use is intended, say so explicitly and separate it from public-flow claims.

---

### 3) Public-claim wording can drift faster than evidence
Once a local slice feels “real,” docs, chat replies, and memory summaries tend to upgrade language before the outside world can verify it.

**Failure mode:**
- docs or chat say `the route is now X` when only source code says that,
- downstream readers mistake repo intent for live truth.

**Mitigation:**
- bind public wording to one external proof source per claim,
- require an explicit claim form: `implemented locally`, `pushed`, or `live`.

---

### 4) Ahead-of-origin state can silently accumulate and normalize ambiguity
One local-only commit is obvious. Two or more can start to feel like a new baseline, and the boundary becomes psychologically invisible.

**Failure mode:**
- operators stop noticing that origin/deploy truth is stale,
- later verification compares against the wrong assumed baseline.

**Mitigation:**
- surface the ahead count in status checks,
- treat prolonged ahead-of-origin state as a first-class blocker, not background noise.

---

### 5) Verified live truth can be unintentionally overwritten by fresher local memory
Recent local activity is more salient than older live verification, which creates recency bias.

**Failure mode:**
- old but still-canonical public truth gets replaced in summaries by newer unverified local truth,
- causing downstream confusion about what users can actually observe.

**Mitigation:**
- preserve `last verified live state` as a distinct field in notes and replies,
- never replace it until a new live check lands.

---

### 6) Deployment troubleshooting can be skipped because the code path already feels resolved
A working local build tempts teams to assume deployment will be trivial.

**Failure mode:**
- publish/deploy proof is deferred indefinitely,
- the real blocker shifts from engineering to coordination, but that shift stays unspoken.

**Mitigation:**
- classify the state explicitly as `implementation complete, publication unresolved`,
- make the missing external proof visible as the active blocker.

## Hardened rule
For any externally meaningful ÆNS slice, progress must remain three-state explicit:
1. **local implementation truth**,
2. **remote publication truth**,
3. **verified public/deploy truth**.

No wallet-flow recommendation or public-surface claim should advance beyond the highest state actually proven.

## Immediate follow-up guidance
- Use explicit state labels in heartbeat/status replies.
- Keep wallet actions downstream of verified remote/deploy state unless local/manual execution is intentionally requested.
- When ahead-of-origin persists, treat the missing publish/deploy proof as the blocker, not as a footnote.
