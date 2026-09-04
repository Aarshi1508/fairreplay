"use client";

import { Lock, Unlock, Check, EyeOff } from "lucide-react";
import type { EVHindsight, EVAction } from "@/data/evScenario";
import type { EVDecisionResult } from "@/lib/evDecisionEngine";

const unknowns = [
  "Future traffic on the remaining route",
  "Whether a charger would stay available",
  "Whether the reserve would actually hold",
];

function qualityClasses(quality: EVHindsight["decisionQuality"]) {
  if (quality === "GOOD") {
    return "border-signal-green/30 bg-signal-green/10 text-signal-green";
  }
  if (quality === "REASONABLE") {
    return "border-signal-amber/30 bg-signal-amber/10 text-signal-amber";
  }
  return "border-signal-red/30 bg-signal-red/10 text-signal-red";
}

function contextLine(unfavorable: boolean, quality: EVHindsight["decisionQuality"], action: EVAction) {
  if (unfavorable && quality !== "POOR") {
    return `${action === "CHARGE" ? "Charging" : "Continuing"} didn't leave the usual margin. Every input available at T still supported the decision — that's the point.`;
  }
  if (!unfavorable && quality === "GOOD") {
    return "The outcome and the decision happen to agree here — but the outcome isn't why the decision was correct.";
  }
  return "Decision quality and outcome quality are tracked separately here, on purpose.";
}

export default function EVHindsightReveal({
  hindsight,
  decision,
  revealed,
  onReveal,
}: {
  hindsight: EVHindsight;
  decision: EVDecisionResult;
  revealed: boolean;
  onReveal: () => void;
}) {
  const decisionScore =
    decision.recommendation === "CHARGE" ? decision.chargeScore : decision.continueScore;

  const supportingReasons = decision.reasons.filter(
    (r) => r.action === decision.recommendation && r.polarity === "support"
  );

  const unfavorable =
    hindsight.result === "RESERVE_BREACHED" || hindsight.result === "ROUTE_DELAYED";

  if (!revealed) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-sm border border-dashed border-base-line2 bg-base-panel px-6 py-16 text-center">
        <Lock size={22} className="text-ink-faint" />
        <p className="max-w-sm text-sm text-ink">
          The future stays locked until you choose to look at it — same as
          it was for the vehicle at decision time.
        </p>
        <button
          onClick={onReveal}
          className="label-mono rounded-sm bg-signal-green px-6 py-3 text-xs text-base transition hover:bg-signal-green/90"
        >
          REVEAL WHAT ACTUALLY HAPPENED
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="label-mono flex items-center gap-2 text-xs text-signal-green">
        <Unlock size={13} />
        FUTURE UNLOCKED
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* AT DECISION TIME */}
        <div className="rounded-sm border border-base-line bg-base-panel p-6">
          <span className="label-mono text-[11px] text-ink-faint">
            AT DECISION TIME
          </span>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="label-mono text-[10px] text-ink-faint">
                MODEL RECOMMENDATION
              </span>
              <div className="font-display mt-1 text-xl font-bold text-ink">
                {decision.recommendation}
              </div>
              <div className="mt-1 text-sm text-ink-muted">
                Decision score: {decisionScore}
              </div>
            </div>

            <div>
              <span className="label-mono text-[10px] text-ink-faint">
                DECISION RECORDED AT T
              </span>
              <div className="font-display mt-1 text-xl font-bold text-ink">
                {hindsight.actionTaken}
              </div>
              {hindsight.actionTaken !== decision.recommendation ? (
                <div className="mt-1 text-sm text-signal-amber">
                  Diverged from the model recommendation
                </div>
              ) : (
                <div className="mt-1 text-sm text-ink-muted">
                  Matched the model recommendation
                </div>
              )}
            </div>
          </div>

          {supportingReasons.length > 0 && (
            <div className="mt-5 space-y-1.5 border-t border-base-line pt-4">
              <span className="label-mono text-[10px] text-ink-faint">
                WHY THE MODEL RECOMMENDED {decision.recommendation}
              </span>
              {supportingReasons.map((r) => (
                <div
                  key={r.text}
                  className="flex items-start gap-2 text-sm text-ink"
                >
                  <Check size={13} className="mt-0.5 shrink-0 text-signal-green" />
                  {r.text}
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 border-t border-base-line pt-4">
            <span className="label-mono text-[10px] text-ink-faint">
              WHAT WAS UNKNOWN AT T
            </span>
            <ul className="mt-2 space-y-1.5">
              {unknowns.map((u) => (
                <li
                  key={u}
                  className="flex items-start gap-2 text-sm text-ink-faint"
                >
                  <EyeOff size={12} className="mt-0.5 shrink-0 text-base-line2" />
                  <span className="select-none blur-[2px]">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AFTER THE ROUTE */}
        <div className="flex flex-col justify-between rounded-sm border border-base-line bg-base-panel p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-mono text-[11px] text-ink-faint">
                AFTER THE ROUTE
              </span>
              <span className="label-mono rounded-sm border border-base-line2 px-1.5 py-0.5 text-[9px] text-ink-faint">
                HINDSIGHT
              </span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {hindsight.timeline.map((line) => (
                <li key={line} className="text-sm text-ink">
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-base-line pt-4">
              <span className="text-sm text-ink-muted">Decision quality</span>
              <span
                className={`label-mono rounded-sm border px-2.5 py-1 text-xs ${qualityClasses(
                  hindsight.decisionQuality
                )}`}
              >
                {hindsight.decisionQuality}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-ink-muted">Outcome</span>
              <span className="label-mono rounded-sm border border-signal-amber/30 bg-signal-amber/10 px-2.5 py-1 text-xs text-signal-amber">
                {unfavorable ? "UNFAVORABLE" : "FAVORABLE"}
              </span>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink">
            {hindsight.qualityRationale}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-sm border border-base-line2 bg-base-raised px-6 py-8 text-center">
        <span className="font-display text-lg font-bold text-ink">
          DECISION QUALITY
        </span>
        <span className="text-signal-green">≠</span>
        <span className="font-display text-lg font-bold text-ink">
          OUTCOME QUALITY
        </span>
        <p className="max-w-md text-sm text-ink">
          Decision quality is evaluated from the information available at T.
          Outcome quality is evaluated after the future is revealed.
        </p>
        <p className="mt-3 max-w-md text-sm text-ink">
          {contextLine(unfavorable, hindsight.decisionQuality, hindsight.actionTaken)}
        </p>
      </div>
    </div>
  );
}
