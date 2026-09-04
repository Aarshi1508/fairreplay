import type { EVDecisionPointState, EVFleetScenario } from "@/data/evScenario";

export default function EVFleetHeader({
  scenario,
  state,
}: {
  scenario: EVFleetScenario;
  state: EVDecisionPointState;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-base-line pb-6">
      <div>
        <div className="label-mono mb-3 inline-flex items-center gap-2 rounded-sm border border-signal-amber/30 bg-signal-amber/10 px-2.5 py-1 text-[11px] text-signal-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-amber" />
          EV FLEET APPLICATION — DEMO SCENARIO, NOT LIVE TELEMETRY
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">
          {state.vehicleId}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {scenario.fleetName} · {scenario.operator} · Fleet of {scenario.fleetSize}
        </p>
      </div>

      <div className="flex gap-8 label-mono text-right">
        <div>
          <div className="text-[11px] text-ink-faint">DECISION</div>
          <div className="font-display mt-1 text-xl font-medium text-ink">
            {state.label}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-ink-faint">DISTANCE LEFT</div>
          <div className="font-display mt-1 text-xl font-medium text-ink">
            {state.distanceRemainingKm} km
          </div>
        </div>
      </div>
    </div>
  );
}
