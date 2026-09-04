export default function DecisionTimeline({ label }: { label: string }) {
  return (
    <div className="relative">
      <div className="flex h-14 overflow-hidden rounded-sm border border-base-line2">
        <div className="relative flex-[1.4] bg-base-raised">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(23,23,23,0.06)_0,rgba(23,23,23,0.06)_1px,transparent_1px,transparent_10px)]" />
        </div>
        <div className="flex-1 bg-base [background-image:repeating-linear-gradient(135deg,rgba(23,23,23,0.05)_0,rgba(23,23,23,0.05)_2px,transparent_2px,transparent_9px)]" />
      </div>

      <div
        className="absolute inset-y-0 flex flex-col items-center"
        style={{ left: "58.3%", transform: "translateX(-50%)" }}
      >
        <div className="h-14 w-[2px] animate-boundary-pulse rounded-full bg-signal-red" />
        <span className="label-mono mt-1.5 whitespace-nowrap text-[9px] text-signal-red">
          INFORMATION LOCK
        </span>
      </div>

      <div
        className="absolute -top-8 flex -translate-x-1/2 flex-col items-center"
        style={{ left: "58.3%" }}
      >
        <span className="label-mono text-[11px] text-signal-red">
          DECISION POINT {label}
        </span>
      </div>

      <div className="mt-8 flex justify-between label-mono text-[11px] text-ink-faint">
        <span>PAST — DECISION-TIME INFORMATION</span>
        <span>FUTURE — HIDDEN UNTIL REVEAL</span>
      </div>
    </div>
  );
}
