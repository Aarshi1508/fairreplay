import { EyeOff, Check, X } from "lucide-react";
import type { DecisionPointState } from "@/data/scenarios";

const hiddenItems = [
  "Future opponent action",
  "Future pace",
  "Future traffic",
  "Future incidents",
  "Final outcome",
];

export default function InformationBoundary({
  state,
  position,
}: {
  state: DecisionPointState;
  position: string;
}) {
  const availableItems = [
    `Current gap — ${state.gapSeconds.toFixed(1)}s`,
    `Current speed — ${state.speedKph} km/h`,
    `Position — ${position}`,
    `Energy state — ${state.energyPercent} (modelled)`,
    `Tyre state — ${state.tyre}, lap ${state.tyreAgeLaps}`,
    `DRS status — ${state.drsAvailable ? "available" : "unavailable"}`,
    `Recent pace trend — ${state.recentPaceDeltaSeconds < 0 ? "closing" : "not closing"}`,
    `Opponent's gap trend — ${state.opponentGapTrend}`,
  ];

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-base-line bg-base-line md:grid-cols-2">
      <div className="bg-base-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="label-mono text-xs text-ink">INFORMATION AVAILABLE</span>
          <span className="label-mono flex items-center gap-1.5 rounded-sm border border-signal-green/30 bg-signal-green/10 px-2 py-1 text-[10px] text-signal-green">
            <Check size={11} /> KNOWN AT T
          </span>
        </div>
        <ul className="space-y-2.5">
          {availableItems.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative bg-base-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="label-mono text-xs text-ink-faint">INFORMATION HIDDEN</span>
          <span className="label-mono flex items-center gap-1.5 rounded-sm border border-base-line2 bg-base-raised px-2 py-1 text-[10px] text-ink-faint">
            <EyeOff size={11} /> NO HINDSIGHT
          </span>
        </div>
        <ul className="space-y-2.5">
          {hiddenItems.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-ink-faint">
              <X size={13} className="mt-0.5 shrink-0 text-base-line2" />
              <span className="blur-[3px] select-none">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-faint">
          Future information hidden until reveal.
        </p>
      </div>
    </div>
  );
}
