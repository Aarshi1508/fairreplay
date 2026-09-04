import type { EVDecisionPointState } from "@/data/evScenario";
import { Zap, MapPin, CarFront, BatteryCharging, Users } from "lucide-react";

function MetricCard({
  label,
  value,
  unit,
  icon,
  accent = false,
  tag,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  accent?: boolean;
  tag?: "MEASURED" | "MODELLED" | "ASSUMED";
}) {
  return (
    <div className="rounded-sm border border-base-line bg-base-panel px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="label-mono text-[11px] text-ink-faint">{label}</span>
        <span className={accent ? "text-signal-green" : "text-ink-faint"}>{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-medium text-ink">{value}</span>
        {unit && <span className="text-xs text-ink-faint">{unit}</span>}
      </div>
      {tag && (
        <div className="label-mono mt-2 text-[9px] text-ink-faint">{tag}</div>
      )}
    </div>
  );
}

export default function EVMetrics({ state }: { state: EVDecisionPointState }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="ENERGY STATE" value={state.energyPercent.toString()} icon={<Zap size={16} />} accent tag="MODELLED" />
        <MetricCard label="DISTANCE" value={state.distanceRemainingKm.toString()} unit="km" icon={<MapPin size={16} />} tag="ASSUMED" />
        <MetricCard label="TRAFFIC" value={state.trafficCondition} icon={<CarFront size={16} />} tag="ASSUMED" />
        <MetricCard label="CHARGER" value={state.chargerAvailability} icon={<BatteryCharging size={16} />} accent={state.chargerAvailability === "AVAILABLE"} tag="ASSUMED" />
        <MetricCard label="FLEET RESERVE" value={`${state.fleetVehiclesBelowReserve} of ${state.fleetSize}`} icon={<Users size={16} />} tag="ASSUMED" />
      </div>
      <p className="mt-3 text-xs text-ink-faint">
        Demo scenario values — ASSUMED for this walkthrough. ENERGY STATE is MODELLED from the same finite-reservoir formula used in the F1 scenario, not measured vehicle telemetry — this prototype has no live fleet data feed.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="label-mono text-[9px] text-ink-faint">
          <span className="text-ink-muted">MEASURED</span> — directly observed
        </span>
        <span className="label-mono text-[9px] text-ink-faint">
          <span className="text-ink-muted">MODELLED</span> — produced by the engine's model, not directly observed
        </span>
        <span className="label-mono text-[9px] text-ink-faint">
          <span className="text-ink-muted">ASSUMED</span> — set for this prototype scenario
        </span>
        <span className="label-mono text-[9px] text-ink-faint">
          <span className="text-ink-muted">HINDSIGHT</span> — known only after reveal
        </span>
      </div>
    </div>
  );
}
