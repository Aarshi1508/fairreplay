"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import EVFleetHeader from "@/components/ev/EVFleetHeader";
import EVMetrics from "@/components/ev/EVMetrics";
import DecisionTimeline from "@/components/DecisionTimeline";
import EVInformationBoundary from "@/components/ev/EVInformationBoundary";
import EVActionComparison from "@/components/ev/EVActionComparison";
import EVDecisionRecommendation from "@/components/ev/EVDecisionRecommendation";
import DecisionSlider from "@/components/DecisionSlider";
import EVDecisionDeltaPanel from "@/components/ev/EVDecisionDeltaPanel";
import EVHindsightReveal from "@/components/ev/EVHindsightReveal";
import DecisionExplanation from "@/components/DecisionExplanation";
import { evFleetScenario } from "@/data/evScenario";
import { evaluateEVDecision } from "@/lib/evDecisionEngine";

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="label-mono text-xs text-signal-green">{n}</span>
      <span className="font-display text-sm font-medium uppercase tracking-wide text-ink">
        {title}
      </span>
      <span className="h-px flex-1 bg-base-line" />
    </div>
  );
}

const decisionPointDescriptions: Record<string, string> = {
  e1: "Decision-time baseline",
  e2: "Next decision point",
  e3: "Later decision point",
};

export default function EVReplayPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const decisionPoint = evFleetScenario.decisionPoints[selectedIndex];
  // The EV decision engine only ever receives decision-time state — never hindsight.
  const decisionResult = useMemo(
    () => evaluateEVDecision(decisionPoint.state),
    [decisionPoint.state]
  );

  const prevPoint = selectedIndex > 0 ? evFleetScenario.decisionPoints[selectedIndex - 1] : null;
  const prevResult = useMemo(
    () => (prevPoint ? evaluateEVDecision(prevPoint.state) : null),
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
        <Link
          href="/replay"
          className="group mb-8 inline-flex items-center gap-2 text-xs text-ink-faint transition hover:text-ink"
        >
          <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" />
          BACK TO F1 PROOF OF CONCEPT
        </Link>

        <div className="mb-10 rounded-sm border border-signal-green/30 bg-signal-green/[0.06] px-6 py-5">
          <span className="label-mono text-[11px] text-signal-green">
            EV FLEET APPLICATION
          </span>
          <p className="font-display mt-2 text-sm font-bold uppercase tracking-wide text-ink">
            Same boundary. Different domain.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink">
            F1 demonstrates the decision-integrity principle. This is the
            same architecture — state at T, an information boundary, a
            decision engine, then hindsight — applied to a small EV fleet
            energy decision. DEMO EVALUATION over a fixed, illustrative
            scenario, not a production fleet optimizer.
          </p>
        </div>

        <div className="mb-16">
          <EVFleetHeader scenario={evFleetScenario} state={decisionPoint.state} />
          <div className="mt-8">
            <EVMetrics state={decisionPoint.state} />
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
          <EVInformationBoundary state={decisionPoint.state} />
        </section>

        <section className="mb-16">
          <SectionLabel n="03" title="Should this vehicle charge or continue?" />
          <div className="space-y-4">
            <EVActionComparison result={decisionResult} />
            <EVDecisionRecommendation
              result={decisionResult}
              state={decisionPoint.state}
            />
          </div>
        </section>

        <section className="mb-16">
          <SectionLabel n="04" title="Move the decision point" />
          <p className="mb-8 max-w-xl text-sm text-ink">
            Step the decision point across the route. The recommendation is
            recalculated from the state at each point — it is not fixed to
            one answer.
          </p>
          <DecisionSlider
            points={evFleetScenario.decisionPoints.map((p) => ({
              id: p.state.id,
              label: p.state.label,
              secondaryLabel: p.state.timeMarker,
            }))}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            accent="green"
          />
          <div className="mt-8">
            <EVDecisionDeltaPanel
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
          <EVHindsightReveal
            hindsight={decisionPoint.hindsight}
            decision={decisionResult}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
          />
        </section>

        <DecisionExplanation />
      </main>
    </>
  );
}
