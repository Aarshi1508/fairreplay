"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import RaceHeader from "@/components/RaceHeader";
import RaceMetrics from "@/components/RaceMetrics";
import DecisionTimeline from "@/components/DecisionTimeline";
import InformationBoundary from "@/components/InformationBoundary";
import ActionComparison from "@/components/ActionComparison";
import DecisionRecommendation from "@/components/DecisionRecommendation";
import DecisionSlider from "@/components/DecisionSlider";
import DecisionDeltaPanel from "@/components/DecisionDeltaPanel";
import HindsightReveal from "@/components/HindsightReveal";
import DecisionExplanation from "@/components/DecisionExplanation";
import { scenario } from "@/data/scenarios";
import { evaluateDecision } from "@/lib/decisionEngine";

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="label-mono text-xs text-signal-red">{n}</span>
      <span className="font-display text-sm font-medium uppercase tracking-wide text-ink">
        {title}
      </span>
      <span className="h-px flex-1 bg-base-line" />
    </div>
  );
}

const decisionPointDescriptions: Record<string, string> = {
  t1: "Decision-time baseline",
  t2: "Next decision point",
  t3: "Later decision point",
};

export default function ReplayPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const decisionPoint = scenario.decisionPoints[selectedIndex];
  // The decision engine only ever receives decision-time state — never hindsight.
  const decisionResult = useMemo(
    () => evaluateDecision(decisionPoint.state),
    [decisionPoint.state]
  );

  const prevPoint = selectedIndex > 0 ? scenario.decisionPoints[selectedIndex - 1] : null;
  const prevResult = useMemo(
    () => (prevPoint ? evaluateDecision(prevPoint.state) : null),
    [prevPoint]
  );

  function handleSelect(index: number) {
    setSelectedIndex(index);
    setRevealed(false);
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-16">
          <RaceHeader scenario={scenario} state={decisionPoint.state} />
          <div className="mt-8">
            <RaceMetrics state={decisionPoint.state} />
          </div>
        </div>

        <section className="mb-16">
          <SectionLabel
            n="02"
            title={`Decision Point ${decisionPoint.state.label} — ${
              decisionPointDescriptions[decisionPoint.state.id] ?? "Decision-time state"
            }`}
          />
          <div className="mb-10 pt-8">
            <DecisionTimeline label={decisionPoint.state.label} />
          </div>
          <InformationBoundary state={decisionPoint.state} position={scenario.position} />
        </section>

        <section className="mb-16">
          <SectionLabel n="03" title="What should the driver do?" />
          <div className="space-y-4">
            <ActionComparison result={decisionResult} />
            <DecisionRecommendation
              result={decisionResult}
              state={decisionPoint.state}
              position={scenario.position}
            />
          </div>
        </section>

        <section className="mb-16">
          <SectionLabel n="04" title="Move the decision point" />
          <p className="mb-8 max-w-xl text-sm text-ink">
            Drag the decision point across the lap. The recommendation is
            recalculated from the state at each point — it is not fixed to
            one answer.
          </p>
          <DecisionSlider
            points={scenario.decisionPoints.map((p) => ({
              id: p.state.id,
              label: p.state.label,
              secondaryLabel: p.state.lapMarker,
            }))}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
          <div className="mt-8">
            <DecisionDeltaPanel
              prev={prevPoint?.state ?? null}
              current={decisionPoint.state}
              prevLabel={prevPoint?.state.label ?? ""}
              currentLabel={decisionPoint.state.label}
              prevRecommendation={prevResult?.recommendation ?? null}
              currentRecommendation={decisionResult.recommendation}
            />
          </div>
        </section>

        <section className="mb-16">
          <SectionLabel n="05" title="Hindsight reveal" />
          <HindsightReveal
            hindsight={decisionPoint.hindsight}
            decision={decisionResult}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
          />
        </section>

        <DecisionExplanation />

        <div className="mt-10 flex flex-col items-start gap-3 rounded-sm border border-signal-green/30 bg-signal-green/[0.06] px-6 py-6">
          <span className="label-mono text-[11px] text-signal-green">
            F1 IS THE PROOF OF CONCEPT
          </span>
          <p className="max-w-xl text-sm text-ink">
            The same information boundary and decision engine apply to a
            real-world mobility decision: an EV fleet vehicle deciding
            whether to charge or continue.
          </p>
          <Link
            href="/replay/ev"
            className="group flex items-center gap-2 text-sm font-medium text-signal-green transition hover:text-signal-green/80"
          >
            See the EV fleet application
            <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    </>
  );
}
