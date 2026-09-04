import type { DecisionPointState, Scenario } from "@/data/scenarios";

export default function RaceHeader({
  scenario,
  state,
}: {
  scenario: Scenario;
  state: DecisionPointState;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-base-line pb-6">
      <div>
        <div className="label-mono mb-3 inline-flex items-center gap-2 rounded-sm border border-signal-amber/30 bg-signal-amber/10 px-2.5 py-1 text-[11px] text-signal-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-amber" />
          PROTOTYPE REPLAY — DEMO SCENARIO, NOT LIVE TELEMETRY
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">
          {scenario.driver}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {scenario.team} · {scenario.circuit} · vs. {scenario.opponent}
        </p>
      </div>

      <div className="flex gap-8 label-mono text-right">
        <div>
          <div className="text-[11px] text-ink-faint">LAP</div>
          <div className="font-display mt-1 text-xl font-medium text-ink">
            {state.lapMarker}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-ink-faint">POSITION</div>
          <div className="font-display mt-1 text-xl font-medium text-ink">
            {scenario.position}
          </div>
        </div>
      </div>
    </div>
  );
}
