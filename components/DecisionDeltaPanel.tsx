import { ArrowRight } from "lucide-react";
import type { DecisionPointState, DecisionAction } from "@/data/scenarios";

function paceLabel(delta: number) {
  if (delta < 0) return "Closing";
  if (delta > 0) return "Opening";
  return "Stable";
}

function Row({
  label,
  from,
  to,
  changed = false,
}: {
  label: string;
  from: string;
  to: string;
  changed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-base-line py-3 last:border-b-0">
      <span className="label-mono text-[11px] text-ink-faint">{label}</span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-ink-muted">{from}</span>
        <ArrowRight
          size={13}
          className={changed ? "text-signal-red" : "text-ink-faint"}
        />
        <span className={changed ? "font-medium text-ink" : "text-ink"}>
          {to}
        </span>
      </div>
    </div>
  );
}

export default function DecisionDeltaPanel({
  prev,
  current,
  prevLabel,
  currentLabel,
  prevRecommendation,
  currentRecommendation,
}: {
  prev: DecisionPointState | null;
  current: DecisionPointState;
  prevLabel: string;
  currentLabel: string;
  prevRecommendation: DecisionAction | null;
  currentRecommendation: DecisionAction;
}) {
  if (!prev || !prevRecommendation) {
    return (
      <div className="rounded-sm border border-dashed border-base-line2 bg-base-panel px-6 py-6 text-center">
        <span className="label-mono text-xs text-ink-faint">
          {currentLabel} — FIRST DECISION POINT, NOTHING TO COMPARE YET
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-base-line bg-base-panel p-6">
      <div className="label-mono mb-3 text-xs text-ink">
        {prevLabel} → {currentLabel}
      </div>

      <div>
        <Row
          label="GAP"
          from={`${prev.gapSeconds.toFixed(1)}s`}
          to={`${current.gapSeconds.toFixed(1)}s`}
        />
        <Row
          label="ENERGY STATE"
          from={`${prev.energyPercent} (modelled)`}
          to={`${current.energyPercent} (modelled)`}
        />
        <Row
          label="DRS"
          from={prev.drsAvailable ? "ON" : "OFF"}
          to={current.drsAvailable ? "ON" : "OFF"}
        />
        <Row
          label="PACE"
          from={paceLabel(prev.recentPaceDeltaSeconds)}
          to={paceLabel(current.recentPaceDeltaSeconds)}
        />
        <Row
          label="RECOMMENDATION"
          from={prevRecommendation}
          to={currentRecommendation}
          changed={prevRecommendation !== currentRecommendation}
        />
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Recalculated from the state above — the recommendation changes
        because the available information changes, not because of a fixed
        script.
      </p>
    </div>
  );
}
