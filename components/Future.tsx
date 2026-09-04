import Link from "next/link";
import { ArrowRight } from "lucide-react";

const roadmap = [
  { stage: "NOW", text: "F1 decision replay — interactive, three decision points" },
  { stage: "APPLIED", text: "EV fleet decision scenario — same architecture, real-world mobility" },
  { stage: "NEXT", text: "More decision points + deeper explainability" },
  { stage: "LATER", text: "Additional real-world mobility decision domains" },
];

export default function Future() {
  return (
    <section id="future" className="border-b border-base-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <span className="label-mono text-xs text-ink-faint">05 — FUTURE</span>
        <h2 className="font-display mt-3 max-w-2xl text-2xl font-bold text-ink md:text-3xl">
          Motorsport is the proof of concept
        </h2>
        <p className="mt-3 max-w-xl text-ink">
          FairReplay evaluates decisions under uncertainty using only what
          was knowable at the moment of choice. First demonstrated in F1,
          the same decision-integrity framework can be applied to
          real-world mobility decisions such as EV fleet energy
          coordination.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/replay"
            className="label-mono rounded-sm border border-base-line2 bg-base-raised px-3 py-1.5 text-[11px] text-ink-muted transition hover:border-ink-faint hover:text-ink"
          >
            F1 PROOF OF CONCEPT
          </Link>
          <Link
            href="/replay/ev"
            className="label-mono flex items-center gap-1.5 rounded-sm border border-signal-green/40 bg-signal-green/10 px-3 py-1.5 text-[11px] text-signal-green transition hover:bg-signal-green/20"
          >
            EV FLEET APPLICATION
            <ArrowRight size={11} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-base-line bg-base-line sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map(({ stage, text }) => (
            <div key={stage} className="bg-base-panel px-6 py-6">
              <span
                className={`label-mono text-xs ${
                  stage === "APPLIED" ? "text-signal-green" : "text-signal-red"
                }`}
              >
                {stage}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
