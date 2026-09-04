import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import ConceptSteps from "@/components/ConceptSteps";
import ReplayPreview from "@/components/ReplayPreview";
import HowItWorks from "@/components/HowItWorks";
import Future from "@/components/Future";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <ConceptSteps />
        <ReplayPreview />
        <HowItWorks />
        <Future />
      </main>
      <footer className="px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-faint">
            Prototype note: decision scores are heuristic, not calibrated
            probabilities. Replay values are an illustrative demo scenario —
            not live or historical F1 telemetry. Energy state is a modelled
            reservoir, not measured battery SOC.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 label-mono text-[11px] text-ink-faint">
            <span>FAIRREPLAY — DECISION INTEGRITY ENGINE</span>
            <span>TRACKSHIFT 2026 — FREE PRACTICE</span>
          </div>
          <p className="text-xs italic text-ink-faint">
            Free Practice: systems that adapt, recover, and perform under
            uncertainty.
          </p>
        </div>
      </footer>
    </>
  );
}
