import { runEnergyReservoir } from "@/lib/energyModel";

export type DecisionAction = "ATTACK" | "SAVE";
export type Tyre = "SOFT" | "MEDIUM" | "HARD";
export type GapTrend = "closing" | "stable" | "opening";
export type OutcomeResult =
  | "OVERTAKE_COMPLETED"
  | "OVERTAKE_FAILED"
  | "POSITION_HELD"
  | "POSITION_LOST";

/**
 * Everything in this interface was knowable at decision time T.
 * The decision engine (lib/decisionEngine.ts) receives ONLY this shape.
 */
export interface DecisionPointState {
  id: string;
  label: string;
  lapMarker: string;
  gapSeconds: number;
  opponentGapTrend: GapTrend;
  speedKph: number;
  energyPercent: number;
  tyre: Tyre;
  tyreAgeLaps: number;
  drsAvailable: boolean;
  recentPaceDeltaSeconds: number;
}

/**
 * Everything in this interface was UNKNOWABLE at T.
 * It is only ever shown after the user explicitly reveals it.
 * It is never passed into the decision engine.
 */
export interface Hindsight {
  actionTaken: DecisionAction;
  timeline: string[];
  result: OutcomeResult;
  resultLabel: string;
  decisionQuality: "GOOD" | "REASONABLE" | "POOR";
  qualityRationale: string;
}

export interface DecisionPoint {
  state: DecisionPointState;
  hindsight: Hindsight;
}

export interface Scenario {
  id: string;
  driver: string;
  team: string;
  opponent: string;
  circuit: string;
  lapTotal: number;
  position: string;
  decisionPoints: DecisionPoint[];
}

/**
 * ENERGY STATE — MODELLED.
 *
 * These three values feed the T1 / T2 / T3 decision points below. They are
 * produced by the same finite-reservoir formula in lib/energyModel.ts that
 * the EV fleet scenario uses (energy_next = energy_current - consumption +
 * recovery), not typed in directly. This is a demo model, not real F1
 * battery SOC / ERS telemetry.
 */
const [t1Energy, t2Energy, t3Energy] = runEnergyReservoir(92, [
  { consumption: 14, recovery: 0 }, // T1 — sustained push, no recovery phase yet
  { consumption: 15, recovery: 2 }, // T2 — lift-and-coast recovers a little
  { consumption: 13, recovery: 2 }, // T3 — another partial recovery before the push
]);

export const scenario: Scenario = {
  id: "demo-01",
  driver: "Driver A",
  team: "Prototype Team",
  opponent: "Car Ahead",
  circuit: "Prototype Circuit",
  lapTotal: 58,
  position: "P2",
  decisionPoints: [
    {
      state: {
        id: "t1",
        label: "T1",
        lapMarker: "Lap 44 / 58",
        gapSeconds: 0.8,
        opponentGapTrend: "closing",
        speedKph: 312,
        energyPercent: t1Energy,
        tyre: "MEDIUM",
        tyreAgeLaps: 18,
        drsAvailable: true,
        recentPaceDeltaSeconds: -0.18,
      },
      hindsight: {
        actionTaken: "ATTACK",
        timeline: [
          "Closed to DRS range into Turn 3",
          "Committed to the inside line on the run to Turn 4",
          "Opponent defended the inside and held the racing line",
          "Contact avoided, no position gained",
        ],
        result: "OVERTAKE_FAILED",
        resultLabel: "Attack attempted — overtake failed",
        decisionQuality: "GOOD",
        qualityRationale:
          "Given the information available at T — including gap, DRS availability and closing pace — the model favored attacking. The opponent's defense was not knowable in advance. A rational decision produced an unfavorable outcome.",
      },
    },
    {
      state: {
        id: "t2",
        label: "T2",
        lapMarker: "Lap 49 / 58",
        gapSeconds: 1.2,
        opponentGapTrend: "opening",
        speedKph: 298,
        energyPercent: t2Energy,
        tyre: "MEDIUM",
        tyreAgeLaps: 23,
        drsAvailable: false,
        recentPaceDeltaSeconds: 0.09,
      },
      hindsight: {
        actionTaken: "SAVE",
        timeline: [
          "Backed off to manage energy through the middle sector",
          "Gap stabilized around 1.3s to the finish",
          "Held position to the chequered flag",
        ],
        result: "POSITION_HELD",
        resultLabel: "Position held to the flag",
        decisionQuality: "GOOD",
        qualityRationale:
          "Given the information available at T — DRS unavailable and energy dropping — the model favored conserving the car over a low-scoring attack. The outcome matched the decision this time.",
      },
    },
    {
      state: {
        id: "t3",
        label: "T3",
        lapMarker: "Lap 53 / 58",
        gapSeconds: 0.6,
        opponentGapTrend: "closing",
        speedKph: 315,
        energyPercent: t3Energy,
        tyre: "MEDIUM",
        tyreAgeLaps: 27,
        drsAvailable: true,
        recentPaceDeltaSeconds: -0.24,
      },
      hindsight: {
        actionTaken: "ATTACK",
        timeline: [
          "Used DRS to draw alongside on the back straight",
          "Held the outside line into the final chicane",
          "Completed the move under braking",
        ],
        result: "OVERTAKE_COMPLETED",
        resultLabel: "Attack attempted — overtake completed",
        decisionQuality: "GOOD",
        qualityRationale:
          "Given the information available at T — gap, DRS availability and closing pace — the model favored attacking, and the outcome confirmed it. A good decision matching a good outcome does not make the outcome the reason it was correct.",
      },
    },
  ],
};
