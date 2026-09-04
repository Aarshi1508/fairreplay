/**
 * DECISION-INTEGRITY CORE
 *
 * Shared primitives reused by every domain-specific decision engine
 * (currently: F1 — lib/decisionEngine.ts, EV fleet — lib/evDecisionEngine.ts).
 *
 * This file intentionally holds only the domain-agnostic pieces:
 *  - a clamp helper
 *  - a two-action score normalizer
 *  - a generic reason shape
 *
 * Domain-specific factor logic (what makes ATTACK score higher, what makes
 * CHARGE score higher) stays in each domain's own engine file. This keeps
 * the shared surface small instead of forcing every domain through one
 * over-abstracted "universal" decision function.
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type Polarity = "support" | "caution";

/** A single explanatory input behind a recommendation, for a given action. */
export interface DecisionReason<TAction extends string> {
  action: TAction;
  polarity: Polarity;
  text: string;
}

export interface TwoActionScore {
  scoreA: number;
  scoreB: number;
}

/**
 * Turns two raw heuristic totals into a pair of bounded, human-readable
 * decision scores that sum to 100.
 *
 * These are relative model scores, not calibrated probabilities — the 5–95
 * clamp exists so neither action ever reads as a certainty, not to model a
 * real confidence interval.
 */
export function normalizeTwoActionScores(rawA: number, rawB: number): TwoActionScore {
  const floorA = Math.max(rawA, 1);
  const floorB = Math.max(rawB, 1);
  const total = floorA + floorB;

  const scoreA = clamp(Math.round((floorA / total) * 100), 5, 95);
  const scoreB = 100 - scoreA;

  return { scoreA, scoreB };
}
