# FAIRREPLAY — Decision Integrity Engine

Prototype built for TrackShift 2026 Round 1, entered under **Free
Practice** — systems that adapt, recover, and perform under uncertainty.
This is not a Pit Wall / live-telemetry entry: FairReplay works entirely
on frozen, demo scenario data and never ingests a live feed.

FAIRREPLAY judges decisions using only the information that was available
at the moment they were made, then lets you separately reveal what
actually happened — because a bad outcome doesn't automatically mean a bad
decision. Decisions are made before outcomes are known; FairReplay freezes
the system at decision time T, evaluates the choices available using only
information that existed then, and only afterward reveals what happened.

## What's in this prototype

TrackShift 2026 frames motorsport as a proof of concept, not the
destination. FairReplay's answer: the same decision-integrity architecture
— state at T, an information boundary, a decision engine, then a separate
hindsight reveal — is demonstrated first in F1, then applied to a small,
genuinely working EV fleet energy scenario.

- **Landing page** (`/`) — a short walkthrough: Hero → The Idea (freeze /
  evaluate / reveal) → a live F1 replay preview → one compact architecture
  diagram → Future (F1 proof of concept → EV fleet application → what's
  next). Editorial beige/off-white visual system with racing-red accents;
  the EV domain reuses the same system with a green accent.
- **F1 Replay** (`/replay`) — the interactive decision walkthrough: race
  telemetry (demo data) → decision point T → information boundary → Attack
  vs Save → recommendation → move T (3 states, with a delta panel showing
  what changed and why the recommendation changed) → hindsight reveal (the
  decision-quality-vs-outcome-quality "wow moment"). Links onward to the EV
  fleet application.
- **EV Fleet Replay** (`/replay/ev`) — the same walkthrough shape applied
  to one vehicle in a 4-vehicle demo fleet deciding whether to CHARGE or
  CONTINUE at each of 3 decision points. Explicitly labelled a prototype /
  DEMO EVALUATION, not a production fleet optimizer. Links back to the F1
  proof of concept.
- **Prototype Decision Models** (`lib/decisionEngine.ts` for F1,
  `lib/evDecisionEngine.ts` for EV) — transparent, explainable heuristics,
  not trained models or AI. Each only ever receives its own domain's
  decision-time state — never hindsight, which is a separate, deliberately
  unreachable type until the user clicks reveal. Both reuse a small shared
  core (`lib/decisionCore.ts`) for score normalization and the reason
  shape, so the two-action scoring logic means the same thing in both
  domains without one giant abstracted engine.
- **Energy model** (`lib/energyModel.ts`) — a simple, transparent
  finite-reservoir formula (`energy_next = energy_current - consumption +
  recovery`) that produces every ENERGY STATE value shown in both the F1
  and EV scenarios. Values are MODELLED by this formula, not typed in
  directly, and not real battery SOC / ERS telemetry.
- **Scenario data** (`data/scenarios.ts` for F1, `data/evScenario.ts` for
  EV) — one F1 scenario with three decision points (T1 / T2 / T3) and one
  EV fleet scenario with three decision points (E1 / E2 / E3), each with
  its own state and its own hindsight. Names, teams, and fleet identifiers
  are fictional placeholders.

This is a design/logic prototype, not connected to live telemetry or a
live fleet data feed. Decision scores are relative heuristic outputs —
"Decision score X vs Y" — not calibrated probabilities of success; the
UI states this directly next to every score. The landing-page footer
carries a short prototype/methodology note; both replay pages tag every
value as MEASURED, MODELLED, ASSUMED, or HINDSIGHT — the UI and this
README use the same four terms.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build check

```bash
npm run build
```

## Deploy to Vercel

**Option A — CLI**

```bash
npm install -g vercel
vercel
```

Follow the prompts (link or create a project, accept the detected Next.js
settings). Run `vercel --prod` to deploy to production.

**Option B — Git integration**

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In the Vercel dashboard, click **Add New → Project** and import the repo.
3. Vercel auto-detects Next.js — no config changes needed.
4. Deploy.

## Project structure

```
app/
  page.tsx                landing page
  replay/page.tsx         F1 replay flow (client component)
  replay/ev/page.tsx      EV fleet replay flow (client component)
components/               F1 + shared UI building blocks (see below)
components/ev/            EV-specific UI building blocks
data/scenarios.ts         F1 scenario + decision-point data, typed
data/evScenario.ts        EV fleet scenario + decision-point data, typed
lib/decisionCore.ts        shared score-normalization + reason types
lib/decisionEngine.ts      F1 heuristic decision function
lib/evDecisionEngine.ts    EV fleet heuristic decision function
lib/energyModel.ts         shared finite-reservoir energy model
```

Key shared/F1 components: `Hero`, `ConceptSteps` (The Idea), `ReplayPreview`
(See It In Action), `HowItWorks` (compact architecture diagram), `Future`
(now the F1 → EV → next progression), `RaceHeader`, `RaceMetrics`,
`DecisionTimeline` (reused by both domains), `InformationBoundary`,
`ActionComparison`, `DecisionRecommendation`, `DecisionSlider` (generic,
reused by both domains), `DecisionDeltaPanel`, `HindsightReveal`,
`DecisionExplanation` (reused by both domains).

EV components (`components/ev/`): `EVFleetHeader`, `EVMetrics`,
`EVInformationBoundary`, `EVActionComparison`, `EVDecisionRecommendation`,
`EVDecisionDeltaPanel`, `EVHindsightReveal` — same structure and visual
language as their F1 counterparts, adapted to EV fleet fields.
