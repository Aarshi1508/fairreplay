import { ArrowDown } from "lucide-react";

const beforeBoundary = ["DOMAIN DATA"];
const inBoundary = ["STATE @ T", "DECISION ENGINE"];
const afterBoundary = ["DECISION RECORD", "HINDSIGHT", "EVALUATION"];

const factors = ["STATE", "RESOURCE", "CONSTRAINTS", "OPPORTUNITY", "UNCERTAINTY", "OUTCOME"];

function Node({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <div
      className={`mx-auto w-full max-w-[240px] rounded-sm border px-4 py-2.5 text-center ${
        accent
          ? "border-signal-red/40 bg-signal-red/[0.06]"
          : "border-base-line2 bg-base-raised"
      }`}
    >
      <span className="label-mono text-[11px] text-ink">{label}</span>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown size={13} className="text-ink-faint" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="architecture" className="border-b border-base-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <span className="label-mono text-xs text-ink-faint">
            04 — HOW IT WORKS
          </span>
          <h2 className="font-display mt-3 text-2xl font-bold text-ink md:text-3xl">
            One boundary, enforced
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,340px)_1fr]">
          <div className="rounded-sm border border-base-line bg-base-panel p-6">
            {beforeBoundary.map((label) => (
              <div key={label}>
                <Node label={label} />
                <Connector />
              </div>
            ))}

            <div className="relative my-3 rounded-sm border-2 border-signal-red bg-signal-red/[0.045] px-3 pb-3 pt-4">
              <span className="label-mono absolute -top-2.5 left-1/2 -translate-x-1/2 bg-base-panel px-2 text-[9px] font-medium text-signal-red">
                INFORMATION BOUNDARY
              </span>
              {inBoundary.map((label, i) => (
                <div key={label}>
                  <Node label={label} />
                  {i < inBoundary.length - 1 && <Connector />}
                </div>
              ))}
            </div>

            <Connector />
            {afterBoundary.map((label, i) => (
              <div key={label}>
                <Node label={label} />
                {i < afterBoundary.length - 1 && <Connector />}
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="rounded-sm border border-signal-red bg-signal-red/[0.045] px-6 py-6">
              <p className="font-display text-xl font-bold leading-snug text-ink md:text-2xl">
                Future information never enters the decision engine.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {factors.map((f) => (
                <span
                  key={f}
                  className="label-mono rounded-sm border border-base-line2 bg-base-raised px-3 py-1.5 text-[10px] text-ink-muted"
                >
                  {f}
                </span>
              ))}
            </div>

            <p className="text-sm text-ink-faint">
              Prototype model: transparent heuristic scoring.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
