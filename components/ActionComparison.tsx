import type { DecisionResult } from "@/lib/decisionEngine";

export default function ActionComparison({ result }: { result: DecisionResult }) {
  const cards = [
    { action: "ATTACK" as const, score: result.attackScore },
    { action: "SAVE" as const, score: result.saveScore },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ action, score }) => {
          const isRecommended = result.recommendation === action;
          return (
            <div
              key={action}
              className={`relative overflow-hidden rounded-sm border px-6 py-8 text-center transition ${
                isRecommended
                  ? "border-signal-red bg-signal-red/[0.06]"
                  : "border-base-line bg-base-panel"
              }`}
            >
              <div
                className={`label-mono mb-4 text-xs ${
                  isRecommended ? "text-signal-red" : "text-ink-faint"
                }`}
              >
                {action}
              </div>
              <div className="font-display text-4xl font-bold text-ink md:text-5xl">
                {score}
              </div>
              <div className="label-mono mt-2 text-[10px] text-ink-faint">
                DECISION SCORE
              </div>

              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-base-line">
                <div
                  className={isRecommended ? "h-full bg-signal-red" : "h-full bg-base-line2"}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-ink-faint">
        Relative model score based on information available at T — not a calibrated probability of success.
      </p>
    </div>
  );
}
