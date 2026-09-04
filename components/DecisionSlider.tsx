"use client";

export interface SliderPoint {
  id: string;
  label: string;
  secondaryLabel: string;
}

export default function DecisionSlider({
  points,
  selectedIndex,
  onSelect,
  accent = "red",
}: {
  points: SliderPoint[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  accent?: "red" | "green";
}) {
  const accentBorder = accent === "green" ? "border-signal-green" : "border-signal-red";
  const accentBg = accent === "green" ? "bg-signal-green" : "bg-signal-red";

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-base-line2" />
        {points.map((point, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={point.id}
              onClick={() => onSelect(i)}
              className="group relative z-10 flex flex-col items-center gap-3"
              aria-pressed={active}
              aria-label={`Move decision point to ${point.label}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${
                  active
                    ? `${accentBorder} ${accentBg}`
                    : "border-base-line2 bg-base group-hover:border-ink-faint"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-base" />}
              </span>
              <span
                className={`label-mono text-xs transition ${
                  active ? "text-ink" : "text-ink-faint group-hover:text-ink-muted"
                }`}
              >
                {point.label}
              </span>
              <span className="text-[11px] text-ink-faint">{point.secondaryLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
