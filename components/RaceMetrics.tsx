import type { DecisionPointState } from "@/data/scenarios";
import { Gauge, Zap, CircleDot, Radio, TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  tag?: "MODELLED" | "ASSUMED";
}) {
  return (
    <div className="rounded-sm border border-base-line bg-base-panel px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="label-mono text-[11px] text-ink-faint">{label}</span>
        <span className={accent ? "text-signal-red" : "text-ink-faint"}>{icon}</span>
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

export default function RaceMetrics({ state }: { state: DecisionPointState }) {
  const trendIcon =
    state.opponentGapTrend === "closing" ? (
      <TrendingDown size={16} />
    ) : state.opponentGapTrend === "opening" ? (
      <TrendingUp size={16} />
    ) : (
      <Minus size={16} />
    );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="GAP" value={state.gapSeconds.toFixed(1)} unit="s" icon={trendIcon} accent tag="ASSUMED" />
        <MetricCard label="SPEED" value={state.speedKph.toString()} unit="km/h" icon={<Gauge size={16} />} tag="ASSUMED" />
        <MetricCard label="ENERGY STATE" value={state.energyPercent.toString()} icon={<Zap size={16} />} tag="MODELLED" />
        <MetricCard label="TYRES" value={state.tyre} unit={`L${state.tyreAgeLaps}`} icon={<CircleDot size={16} />} tag="ASSUMED" />
        <MetricCard
          label="DRS"
          value={state.drsAvailable ? "AVAILABLE" : "UNAVAILABLE"}
          icon={<Radio size={16} />}
          accent={state.drsAvailable}
          tag="ASSUMED"
        />
      </div>
      <p className="mt-3 text-xs text-ink-faint">
        Demo scenario values — ASSUMED for this walkthrough. ENERGY STATE is MODELLED from a synthetic finite-reservoir proxy, not measured battery SOC or ERS state — public F1 telemetry does not expose that data. Prototype values are illustrative where direct telemetry is unavailable.
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
