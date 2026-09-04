import type { EVDecisionPointState, EVAction } from "@/data/evScenario";
import { clamp, normalizeTwoActionScores, type DecisionReason } from "@/lib/decisionCore";

export interface EVDecisionResult {
  chargeScore: number;
  continueScore: number;
  recommendation: EVAction;
  reasons: DecisionReason<EVAction>[];
}

/**
 * PROTOTYPE DECISION MODEL — EV FLEET
 *
 * Same architecture as the F1 engine (lib/decisionEngine.ts): a transparent
 * heuristic, not a trained model, receiving only EV decision-time state
 * (EVDecisionPointState). No field describing what happens after T is ever
 * passed in here.
 *
 * chargeScore / continueScore are relative decision scores (they sum to
 * 100 by construction) — not calibrated probabilities of success. This is
 * a DEMO EVALUATION over a small fixed scenario, not a production fleet
 * optimizer.
 */
export function evaluateEVDecision(state: EVDecisionPointState): EVDecisionResult {
  // --- CHARGE factors ---
  const lowEnergyFactor = clamp((55 - state.energyPercent) * 0.5, -18, 22);
  const distanceFactor = clamp((state.distanceRemainingKm - 20) * 0.5, -14, 18);
  const chargerFactor =
    state.chargerAvailability === "AVAILABLE" ? 14 : state.chargerAvailability === "LIMITED" ? 4 : -20;
  const demandFactor =
    state.estimatedDemandNextHour === "HIGH" ? 12 : state.estimatedDemandNextHour === "MEDIUM" ? 4 : -6;
  const fleetReserveFactor = clamp(state.fleetVehiclesBelowReserve * 8, -6, 20);

  const chargeRaw = 50 + lowEnergyFactor + distanceFactor + chargerFactor + demandFactor + fleetReserveFactor;

  // --- CONTINUE factors ---
  const sufficientEnergyFactor = clamp((state.energyPercent - 55) * 0.5, -18, 22);
  const shortDistanceFactor = clamp((20 - state.distanceRemainingKm) * 0.5, -14, 18);
  const trafficFactor =
    state.trafficCondition === "LIGHT" ? 12 : state.trafficCondition === "MODERATE" ? 2 : -12;
  const chargerScarceFactor = state.chargerAvailability === "UNAVAILABLE" ? 14 : 0;

  const continueRaw = 50 + sufficientEnergyFactor + shortDistanceFactor + trafficFactor + chargerScarceFactor;

  const { scoreA: chargeScore, scoreB: continueScore } = normalizeTwoActionScores(chargeRaw, continueRaw);

  const recommendation: EVAction = chargeScore >= continueScore ? "CHARGE" : "CONTINUE";

  const reasons: DecisionReason<EVAction>[] = [
    {
      action: "CHARGE",
      polarity: state.energyPercent < 55 ? "support" : "caution",
      text:
        state.energyPercent < 55
          ? `Energy reserve limited (${state.energyPercent}, modelled)`
          : `Energy reserve sufficient for now (${state.energyPercent}, modelled)`,
    },
    {
      action: "CHARGE",
      polarity: state.chargerAvailability === "AVAILABLE" ? "support" : "caution",
      text:
        state.chargerAvailability === "AVAILABLE"
          ? "Charger available now"
          : state.chargerAvailability === "LIMITED"
          ? "Charger access is limited"
          : "No charger available at this stop",
    },
    {
      action: "CHARGE",
      polarity: state.estimatedDemandNextHour === "HIGH" ? "support" : "caution",
      text: `Demand next hour: ${state.estimatedDemandNextHour} (assumed)`,
    },
    {
      action: "CHARGE",
      polarity: state.fleetVehiclesBelowReserve > 0 ? "support" : "caution",
      text:
        state.fleetVehiclesBelowReserve > 0
          ? `${state.fleetVehiclesBelowReserve} other fleet vehicle(s) already below reserve`
          : "No other fleet vehicles currently below reserve",
    },
    {
      action: "CONTINUE",
      polarity: state.trafficCondition === "LIGHT" ? "support" : "caution",
      text: `Current traffic condition: ${state.trafficCondition.toLowerCase()}`,
    },
    {
      action: "CONTINUE",
      polarity: state.distanceRemainingKm < 20 ? "support" : "caution",
      text: `Distance remaining: ${state.distanceRemainingKm} km`,
    },
  ];

  return { chargeScore, continueScore, recommendation, reasons };
}
