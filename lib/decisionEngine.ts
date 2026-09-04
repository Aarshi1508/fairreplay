import type { DecisionPointState, DecisionAction } from "@/data/scenarios";
import { clamp, normalizeTwoActionScores, type DecisionReason } from "@/lib/decisionCore";

export type { DecisionReason };

export interface DecisionResult {
  attackScore: number;
  saveScore: number;
  recommendation: DecisionAction;
  reasons: DecisionReason<DecisionAction>[];
}

/**
 * PROTOTYPE DECISION MODEL — F1
 *
 * A transparent, explainable heuristic — not a trained model, not AI.
 * It receives only the state that was knowable at decision time T.
 * No field describing what happens after T is ever passed in here.
 *
 * attackScore / saveScore are relative decision scores (they sum to 100
 * by construction) — not calibrated probabilities of success.
 */
export function evaluateDecision(state: DecisionPointState): DecisionResult {
  // --- ATTACK factors ---
  const gapFactor = clamp((1.6 - state.gapSeconds) * 26, -22, 40);
  const speedFactor = clamp((state.speedKph - 295) * 0.55, -16, 20);
  const drsAttackFactor = state.drsAvailable ? 18 : -14;
  const energyAttackFactor = clamp((state.energyPercent - 50) * 0.46, -16, 20);
  const paceAttackFactor = clamp(-state.recentPaceDeltaSeconds * 42, -20, 26);
  const trendAttackFactor =
    state.opponentGapTrend === "closing" ? 12 : state.opponentGapTrend === "opening" ? -12 : 0;

  const attackRaw =
    50 + gapFactor + speedFactor + drsAttackFactor + energyAttackFactor + paceAttackFactor + trendAttackFactor;

  // --- SAVE factors ---
  const energyPreserveFactor = clamp((58 - state.energyPercent) * 0.5, -16, 20);
  const positionSecurityFactor = clamp(state.gapSeconds * 15, -10, 26);
  const drsSaveFactor = state.drsAvailable ? -12 : 14;
  const trendSaveFactor =
    state.opponentGapTrend === "opening" ? 10 : state.opponentGapTrend === "closing" ? -10 : 0;
  const tyreSaveFactor = clamp((state.tyreAgeLaps - 10) * 0.6, -8, 12);

  const saveRaw =
    50 + energyPreserveFactor + positionSecurityFactor + drsSaveFactor + trendSaveFactor + tyreSaveFactor;

  const { scoreA: attackScore, scoreB: saveScore } = normalizeTwoActionScores(attackRaw, saveRaw);

  const recommendation: DecisionAction = attackScore >= saveScore ? "ATTACK" : "SAVE";

  const reasons: DecisionReason<DecisionAction>[] = [
    {
      action: "ATTACK",
      polarity: state.drsAvailable ? "support" : "caution",
      text: state.drsAvailable ? "DRS available on approach" : "DRS not available this lap",
    },
    {
      action: "ATTACK",
      polarity: state.gapSeconds <= 1.0 ? "support" : "caution",
      text:
        state.gapSeconds <= 1.0
          ? `Gap within attacking range (${state.gapSeconds.toFixed(1)}s)`
          : `Gap outside typical attacking range (${state.gapSeconds.toFixed(1)}s)`,
    },
    {
      action: "ATTACK",
      polarity: state.recentPaceDeltaSeconds < 0 ? "support" : "caution",
      text:
        state.recentPaceDeltaSeconds < 0
          ? "Closing pace faster than opponent over recent laps"
          : "Recent pace not faster than opponent",
    },
    {
      action: "ATTACK",
      polarity: state.energyPercent >= 55 ? "support" : "caution",
      text: state.energyPercent >= 55 ? `Energy reserve sufficient (${state.energyPercent}, modelled)` : `Energy reserve limited (${state.energyPercent}, modelled)`,
    },
    {
      action: "SAVE",
      polarity: state.energyPercent < 60 ? "support" : "caution",
      text: state.energyPercent < 60 ? `Preserves a depleting energy reserve (${state.energyPercent}, modelled)` : "Energy is not yet a constraint",
    },
    {
      action: "SAVE",
      polarity: state.opponentGapTrend === "opening" ? "support" : "caution",
      text:
        state.opponentGapTrend === "opening"
          ? "Gap has been opening — position looks secure"
          : state.opponentGapTrend === "closing"
          ? "Gap has been closing — holding is getting riskier"
          : "Gap has been stable",
    },
  ];

  return { attackScore, saveScore, recommendation, reasons };
}
