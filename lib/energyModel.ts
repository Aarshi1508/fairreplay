import { clamp } from "@/lib/decisionCore";

/**
 * ENERGY RESERVOIR MODEL
 *
 * A deliberately simple, explainable model:
 *
 *   energy_next = energy_current - consumption + recovery
 *
 * This is what "MODELLED" means for ENERGY STATE throughout FairReplay: a
 * value produced by this formula, not a hardcoded number and not real
 * battery SOC / ERS telemetry (public F1 data doesn't expose that, and this
 * prototype doesn't have access to live EV fleet telemetry either).
 *
 * Both the F1 scenario and the EV fleet scenario derive their ENERGY STATE
 * values by running this same function across a sequence of steps, so the
 * "MODELLED" tag means the same thing in both domains.
 */
export interface EnergyStep {
  /** Energy spent during this step (0–100 scale). */
  consumption: number;
  /** Energy regained during this step (0–100 scale), e.g. lift-and-coast, regen, or charging. */
  recovery: number;
}

export function nextEnergyPercent(current: number, step: EnergyStep): number {
  return clamp(current - step.consumption + step.recovery, 0, 100);
}

/** Runs the reservoir model across a sequence of steps, returning the energy value after each step. */
export function runEnergyReservoir(startPercent: number, steps: EnergyStep[]): number[] {
  let energy = clamp(startPercent, 0, 100);
  const values: number[] = [];
  for (const step of steps) {
    energy = nextEnergyPercent(energy, step);
    values.push(Math.round(energy));
  }
  return values;
}
