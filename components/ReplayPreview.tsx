import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { scenario } from "@/data/scenarios";
import { evaluateDecision } from "@/lib/decisionEngine";

export default function ReplayPreview() {
  const point = scenario.decisionPoints[0];
  const result = evaluateDecision(point.state);
  const { state } = point;

  return (
    <section id="replay-preview" className="border-b border-base-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="label-mono text-xs text-ink-faint">
              03 — SEE IT IN ACTION
            </span>
            <h2 className="font-display mt-3 text-2xl font-bold text-ink md:text-3xl">
              The replay, in context
            </h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border border-base-line bg-base-panel">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-line px-6 py-4">
            <span className="label-mono text-xs text-ink-faint">
              {state.lapMarker.toUpperCase()}
            </span>
            <span className="label-mono text-xs text-ink-faint">
              {scenario.position}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-px bg-base-line sm:grid-cols-4">
            <div className="bg-base-panel px-5 py-4">
              <div className="label-mono text-[10px] text-ink-faint">GAP</div>
              <div className="font-mono mt-1 text-lg text-ink">
                {state.gapSeconds.toFixed(1)}s
              </div>
            </div>
            <div className="bg-base-panel px-5 py-4">
              <div className="label-mono text-[10px] text-ink-faint">
                ENERGY STATE
              </div>
              <div className="font-mono mt-1 text-lg text-ink">
                {state.energyPercent} <span className="text-xs text-ink-faint">modelled</span>
              </div>
            </div>
            <div className="bg-base-panel px-5 py-4">
              <div className="label-mono text-[10px] text-ink-faint">DRS</div>
              <div className="font-mono mt-1 text-lg text-ink">
                {state.drsAvailable ? "AVAILABLE" : "UNAVAILABLE"}
              </div>
            </div>
            <div className="bg-base-panel px-5 py-4">
              <div className="label-mono text-[10px] text-ink-faint">
                PACE
              </div>
              <div className="font-mono mt-1 text-lg text-ink">
                {state.recentPaceDeltaSeconds < 0 ? "CLOSING" : "OPENING"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-base-line sm:grid-cols-2">
            <div className="bg-signal-red/[0.06] px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="label-mono text-xs text-signal-red">
                  ATTACK
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {result.attackScore}
                </span>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-base-line">
                <div
                  className="h-full bg-signal-red"
                  style={{ width: `${result.attackScore}%` }}
                />
              </div>
            </div>
            <div className="bg-base-panel px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="label-mono text-xs text-ink-faint">
                  SAVE
                </span>
                <span className="font-display text-2xl font-bold text-ink">
                  {result.saveScore}
                </span>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-base-line">
                <div
                  className="h-full bg-base-line2"
                  style={{ width: `${result.saveScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
            <div>
              <span className="label-mono text-[11px] text-ink-faint">
                RECOMMENDATION
              </span>
              <div className="font-display text-lg font-bold text-ink">
                {result.recommendation}
              </div>
            </div>
            <span className="max-w-xs text-right text-xs text-ink-faint">
              Decision score — not calibrated probability.
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/replay"
            className="group flex items-center gap-2 rounded-sm bg-signal-red px-6 py-3.5 font-medium text-base transition hover:bg-signal-red/90"
          >
            Explore full replay
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
