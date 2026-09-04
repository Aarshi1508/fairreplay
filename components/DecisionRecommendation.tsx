"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus as MinusIcon } from "lucide-react";
import type { DecisionResult } from "@/lib/decisionEngine";
import type { DecisionPointState } from "@/data/scenarios";

export default function DecisionRecommendation({
  result,
  state,
  position,
}: {
  result: DecisionResult;
  state: DecisionPointState;
  position: string;
}) {
  const [open, setOpen] = useState(false);
  const decisionScore =
    result.recommendation === "ATTACK" ? result.attackScore : result.saveScore;
  const relevantReasons = result.reasons.filter((r) => r.action === result.recommendation);

  const inputRows: [string, string][] = [
    ["CURRENT GAP", `${state.gapSeconds.toFixed(1)}s`],
    ["POSITION", position],
    ["SPEED", `${state.speedKph} km/h`],
    ["DRS", state.drsAvailable ? "AVAILABLE" : "UNAVAILABLE"],
    ["PACE", state.recentPaceDeltaSeconds < 0 ? "CLOSING" : "OPENING"],
    ["ENERGY STATE", `${state.energyPercent} · MODELLED`],
    ["TYRE", `${state.tyre} · L${state.tyreAgeLaps}`],
  ];

  return (
    <div className="rounded-sm border border-base-line bg-base-panel">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <div className="label-mono text-[11px] text-ink-faint">
            RECOMMENDATION — PROTOTYPE DECISION MODEL
          </div>
          <div className="font-display mt-1 text-2xl font-bold text-ink">
            {result.recommendation}
          </div>
          <div className="mt-1 text-sm text-ink-muted">
            Decision score: {decisionScore}
          </div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="label-mono flex items-center gap-1.5 rounded-sm border border-base-line2 px-3 py-2 text-xs text-ink-muted transition hover:border-ink-faint hover:text-ink"
        >
          WHY {result.recommendation}?
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-base-line px-6 py-5">
          <span className="label-mono text-[10px] text-ink-faint">
            STATE AVAILABLE AT T
          </span>
          <ul className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {inputRows.map(([label, value]) => (
              <li key={label} className="flex items-center justify-between text-sm">
                <span className="label-mono text-[10px] text-ink-faint">{label}</span>
                <span className="text-ink-muted">{value}</span>
              </li>
            ))}
          </ul>

          <span className="label-mono mt-5 block text-[10px] text-ink-faint">
            DECISION ENGINE OUTPUT
          </span>
          <ul className="mt-2.5 space-y-1.5">
            <li className="flex items-center justify-between text-sm">
              <span className="label-mono text-[10px] text-ink-faint">ATTACK</span>
              <span className="text-ink-muted">{result.attackScore} · decision score</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="label-mono text-[10px] text-ink-faint">SAVE</span>
              <span className="text-ink-muted">{result.saveScore} · decision score</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="label-mono text-[10px] text-ink-faint">SELECTED</span>
              <span className="font-medium text-ink">{result.recommendation}</span>
            </li>
          </ul>

          <span className="label-mono mt-5 block text-[10px] text-ink-faint">
            WHY {result.recommendation}
          </span>
          <ul className="mt-2.5 space-y-2.5">
            {relevantReasons.map((reason) => (
              <li key={reason.text} className="flex items-start gap-2.5 text-sm">
                {reason.polarity === "support" ? (
                  <Plus size={14} className="mt-0.5 shrink-0 text-signal-green" />
                ) : (
                  <MinusIcon size={14} className="mt-0.5 shrink-0 text-signal-amber" />
                )}
                <span className="text-ink">{reason.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
