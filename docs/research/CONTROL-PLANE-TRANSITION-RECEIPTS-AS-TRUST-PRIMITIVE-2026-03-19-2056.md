# Control-plane transition receipts as an ÆNS trust primitive (2026-03-19 20:56 UTC)

## Purpose
Turn the new control-plane transition idea into a more general product/trust rule.

The previous research note asked a narrow question:
- when the preferred route eventually becomes live, what evidence should capture that repair?

That was useful, but still too Vercel-shaped.
The more important question is broader:

> should ÆNS treat control-plane transition receipts as a general trust primitive for agent service surfaces?

## Short answer
### Yes.

Whenever human-controlled or offchain control planes can materially change what a public agent service alias resolves to, the **transition itself** deserves a compact proof surface.

## Source lesson
From `books_and_papers/006_think_distributed_systems.pdf`:
- a distributed system is a set of components plus the network plus the sequence of steps that move it from one state to another
- reasoning about the current state alone is incomplete if relevant transitions are left implicit

Applied here:
- ENS records are a state snapshot
- public-alias checks are a state snapshot
- but a deployment/promotion event is a **state transition** that can materially change public truth

If that transition matters to trust, it should not be invisible.

## Decision
### For ÆNS service surfaces, meaningful human-controlled changes in public truth should be captured as **transition receipts**.

A transition receipt is not the same as:
- an ENS authority proof
- a static public-state snapshot
- a general deployment log

It is a compact trust artifact whose job is to answer:
- what public state existed before
- what human/offchain action was taken
- what public state existed after

## Why this is a trust primitive
This should be treated as a general primitive because the same causal gap can appear in many places, not just Vercel:
- deployment dashboards
- reverse proxies / gateways
- CDN or edge routing control planes
- marketplace/service-directory listing controls
- offchain registries that influence which endpoint a capability actually reaches

In all of those cases, the public alias can change without an ENS change and without an onchain trace.

That means static identity proof is necessary but not sufficient.
ÆNS also benefits from a way to expose **causal public-state changes**.

## Proposed trust stack
ÆNS service trust can now be described as three distinct layers:

### 1) Machine-verifiable authority
Examples:
- ENS root/child relationship
- `parent-authorized` status
- proof artifact fields
- commit-pinned references

### 2) Observed public state
Examples:
- what the current public alias serves at capture time
- readiness verdicts from `bun run check-public-surface`

### 3) Transition receipts
Examples:
- before-state snapshot
- deployment/promote action evidence
- after-state snapshot

This third layer matters because service trust is not only about static truth.
It is also about **causal transitions between public truths**.

## Minimum shape of a transition receipt
A minimal transition receipt should include:

### Before-state
- timestamp
- public-surface check output
- important response metadata when practical (`ETag`, `Last-Modified`, cache metadata)

### Action evidence
- deployment/promotion reference or equivalent control-plane action reference
- timestamp
- intended commit hash
- relevant environment/alias target

### After-state
- timestamp
- rerun public-surface check output
- proof that the alias actually changed in the intended direction

## What this does *not* require
This does **not** require ÆNS v0.1 to solve full deployment attestation or standardize every control plane.

The smaller product claim is enough:
- do not let meaningful public-truth transitions disappear into operator memory

That is already a real improvement.

## Why this matters for the current ÆNS thesis
The core thesis remains the same:
- `pvtclawn.eth` is the identity anchor
- `research.pvtclawn.eth` is the capability surface

Transition receipts do not replace that thesis.
They make it stronger.

They let ÆNS say:
- here is the machine-verifiable authority path
- here is the public surface observed now
- here is the recorded causal transition that changed that public surface

That is a better trust story than static name resolution alone when offchain control planes remain load-bearing.

## Immediate consequence
The Vercel preferred-route repair should be treated as the **first concrete instance** of this more general pattern, not as a one-off dashboard note.

If and when the preferred route becomes live, the right artifact is not just:
- “it works now”

but:
- a compact transition receipt showing before-state, action evidence, and after-state

## Bottom line
ÆNS should treat control-plane transition receipts as a general trust primitive for agent service surfaces whenever human-controlled actions can change public truth.

Static authority matters.
Static public-state snapshots matter.
But meaningful service trust also needs a compact way to explain **how one public truth became another**.
