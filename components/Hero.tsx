import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-base-line">
      <div className="absolute inset-0 bg-grid-track bg-grid-cell opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 md:pt-32">
        <div className="label-mono mb-4 inline-flex items-center gap-2 rounded-sm border border-base-line2 bg-base-raised px-3 py-1.5 text-[10px] text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-red" />
          MOTORSPORT PROOF OF CONCEPT
        </div>

        <div className="label-mono mb-8 flex items-center gap-3 text-xs text-ink-faint">
          <span className="h-px w-8 bg-base-line2" />
          DECISION INTEGRITY ENGINE · TRACKSHIFT 2026 — FREE PRACTICE
        </div>

        <h1 className="font-display max-w-3xl text-[2.75rem] font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
          Judge the decision.
          <br />
          Not the outcome.
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink">
          Decisions are made before outcomes are known. FairReplay freezes
          the system at decision time T, evaluates the choices available
          using only the information that existed then, and only afterward
          reveals what happened. F1 is our proof of concept.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/replay"
            className="group flex items-center gap-2 rounded-sm bg-signal-red px-6 py-3.5 font-medium text-base transition hover:bg-signal-red/90"
          >
            Explore the decision
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
          <span className="label-mono text-xs text-ink-faint">
            ~60–90 SEC WALKTHROUGH
          </span>
        </div>
      </div>
    </section>
  );
}
