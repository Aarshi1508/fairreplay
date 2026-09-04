import { runEnergyReservoir } from "@/lib/energyModel";

export type EVAction = "CHARGE" | "CONTINUE";
export type TrafficCondition = "LIGHT" | "MODERATE" | "HEAVY";
export type ChargerAvailability = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
export type DemandLevel = "LOW" | "MEDIUM" | "HIGH";
export type EVOutcomeResult =
  | "RESERVE_MAINTAINED"
  | "RESERVE_BREACHED"
  | "ROUTE_COMPLETED"
  | "ROUTE_DELAYED";

/**
 * Everything in this interface was knowable at decision time T for this
 * vehicle. The EV decision engine (lib/evDecisionEngine.ts) receives ONLY
 * this shape — same boundary rule as the F1 DecisionPointState.
 */
export interface EVDecisionPointState {
  id: string;
  label: string;
  timeMarker: string;
  vehicleId: string;
  fleetSize: number;
  energyPercent: number;
  distanceRemainingKm: number;
  trafficCondition: TrafficCondition;
  chargerAvailability: ChargerAvailability;
  estimatedDemandNextHour: DemandLevel;
  /** Other fleet vehicles currently below their own reserve threshold — a proxy for charger contention. */
  fleetVehiclesBelowReserve: number;
}

/**
 * Everything in this interface was UNKNOWABLE at T. Only ever shown after
 * the user explicitly reveals it. Never passed into the EV decision engine.
 */
export interface EVHindsight {
  actionTaken: EVAction;
  timeline: string[];
  result: EVOutcomeResult;
  resultLabel: string;
  decisionQuality: "GOOD" | "REASONABLE" | "POOR";
  qualityRationale: string;
}

export interface EVDecisionPoint {
  state: EVDecisionPointState;
  hindsight: EVHindsight;
}

export interface EVFleetScenario {
  id: string;
  fleetName: string;
  operator: string;
  fleetSize: number;
  decisionPoints: EVDecisionPoint[];
}

/**
 * ENERGY STATE — MODELLED.
 *
 * Same reservoir formula as the F1 scenario (lib/energyModel.ts):
 * energy_next = energy_current - consumption + recovery. Demo values, not
 * live vehicle telemetry.
 */
const [ev1Energy, ev2Energy, ev3Energy] = runEnergyReservoir(74, [
  { consumption: 11, recovery: 0 }, // E1 — highway leg, no charging
  { consumption: 9, recovery: 3 }, // E2 — partial opportunity charge
  { consumption: 12, recovery: 1 }, // E3 — stop-start traffic, minor regen
]);

export const evFleetScenario: EVFleetScenario = {
  id: "ev-demo-01",
  fleetName: "Prototype Fleet",
  operator: "Demo Operator",
  fleetSize: 4,
  decisionPoints: [
    {
      state: {
        id: "e1",
        label: "E1",
        timeMarker: "Decision 1 of 3",
        vehicleId: "VEHICLE 03",
        fleetSize: 4,
        energyPercent: ev1Energy,
        distanceRemainingKm: 38,
        trafficCondition: "MODERATE",
        chargerAvailability: "AVAILABLE",
        estimatedDemandNextHour: "MEDIUM",
        fleetVehiclesBelowReserve: 1,
      },
      hindsight: {
        actionTaken: "CONTINUE",
        timeline: [
          "Continued the route past the depot without charging",
          "Traffic on the remaining leg worsened after the decision point",
          "Arrived with a lower-than-typical reserve, route still completed",
        ],
        result: "ROUTE_COMPLETED",
        resultLabel: "Route completed — reserve lower than typical",
        decisionQuality: "REASONABLE",
        qualityRationale:
          "Given the information available at T — a charger available now, moderate traffic and medium demand next hour — the model favored CHARGE over CONTINUE (63 to 37), but not overwhelmingly. The operator continued past the charger instead. Traffic on the remaining leg worsened after the decision point, which was not knowable in advance, and the route was completed, but on a thinner reserve margin than charging would have provided.",
      },
    },
    {
      state: {
        id: "e2",
        label: "E2",
        timeMarker: "Decision 2 of 3",
        vehicleId: "VEHICLE 03",
        fleetSize: 4,
        energyPercent: ev2Energy,
        distanceRemainingKm: 22,
        trafficCondition: "HEAVY",
        chargerAvailability: "LIMITED",
        estimatedDemandNextHour: "HIGH",
        fleetVehiclesBelowReserve: 2,
      },
      hindsight: {
        actionTaken: "CHARGE",
        timeline: [
          "Took a limited charger slot before continuing",
          "Another fleet vehicle needed the same slot minutes later",
          "Both vehicles finished their routes within reserve",
        ],
        result: "RESERVE_MAINTAINED",
        resultLabel: "Reserve maintained across the fleet",
        decisionQuality: "GOOD",
        qualityRationale:
          "Given the information available at T — heavy traffic, high demand forecast, and two other fleet vehicles already below reserve — the model favored CHARGE to protect the reserve. The outcome matched the decision this time.",
      },
    },
    {
      state: {
        id: "e3",
        label: "E3",
        timeMarker: "Decision 3 of 3",
        vehicleId: "VEHICLE 03",
        fleetSize: 4,
        energyPercent: ev3Energy,
        distanceRemainingKm: 14,
        trafficCondition: "LIGHT",
        chargerAvailability: "UNAVAILABLE",
        estimatedDemandNextHour: "LOW",
        fleetVehiclesBelowReserve: 0,
      },
      hindsight: {
        actionTaken: "CONTINUE",
        timeline: [
          "No charger was available at this stop regardless",
          "Continued on light traffic for the final leg",
          "Completed the final route comfortably within reserve",
        ],
        result: "ROUTE_COMPLETED",
        resultLabel: "Final route completed within reserve",
        decisionQuality: "GOOD",
        qualityRationale:
          "Given the information available at T — no charger available, light traffic, and low demand forecast — the model favored CONTINUE. The outcome matched the decision, and the decision would have been the same even if it hadn't: there was no charger to take.",
      },
    },
  ],
};
