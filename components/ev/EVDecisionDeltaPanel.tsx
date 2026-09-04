import { ArrowRight } from "lucide-react";
import type { EVDecisionPointState, EVAction } from "@/data/evScenario";

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
          className={changed ? "text-signal-green" : "text-ink-faint"}
        />
        <span className={changed ? "font-medium text-ink" : "text-ink"}>
          {to}
        </span>
      </div>
    </div>
  );
}

export default function EVDecisionDeltaPanel({
  prev,
  current,
  prevLabel,
  currentLabel,
  prevRecommendation,
  currentRecommendation,
}: {
  prev: EVDecisionPointState | null;
  current: EVDecisionPointState;
  prevLabel: string;
  currentLabel: string;
  prevRecommendation: EVAction | null;
  currentRecommendation: EVAction;
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
          label="ENERGY STATE"
          from={`${prev.energyPercent} (modelled)`}
          to={`${current.energyPercent} (modelled)`}
        />
        <Row
          label="DISTANCE REMAINING"
          from={`${prev.distanceRemainingKm} km`}
          to={`${current.distanceRemainingKm} km`}
        />
        <Row
          label="TRAFFIC"
          from={prev.trafficCondition}
          to={current.trafficCondition}
        />
        <Row
          label="CHARGER AVAILABILITY"
          from={prev.chargerAvailability}
          to={current.chargerAvailability}
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
