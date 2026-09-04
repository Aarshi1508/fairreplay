const steps = [
  {
    n: "01",
    title: "Freeze",
    body: "Lock the information available at T.",
  },
  {
    n: "02",
    title: "Evaluate",
    body: "Score the choices available at that moment.",
  },
  {
    n: "03",
    title: "Reveal",
    body: "Show what actually happened.",
  },
];

export default function ConceptSteps() {
  return (
    <section id="concept" className="border-b border-base-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <span className="label-mono text-xs text-ink-faint">02 — THE IDEA</span>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-base-line bg-base-line md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="bg-base px-8 py-8">
              <div className="label-mono text-xs text-signal-red">{step.n}</div>
              <h3 className="font-display mt-3 text-lg font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <p className="font-display mt-10 max-w-2xl text-xl font-medium leading-snug text-ink md:text-2xl">
          A bad outcome does not necessarily mean a bad decision.
        </p>
      </div>
    </section>
  );
}
