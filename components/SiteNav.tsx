import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-base-line bg-base">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            FAIR<span className="text-signal-red">REPLAY</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 label-mono text-xs text-ink-muted md:flex">
          <Link href="/#concept" className="transition hover:text-ink">
            CONCEPT
          </Link>
          <Link href="/replay" className="transition hover:text-ink">
            REPLAY
          </Link>
          <Link href="/#architecture" className="transition hover:text-ink">
            ARCHITECTURE
          </Link>
          <Link href="/#future" className="transition hover:text-ink">
            FUTURE
          </Link>
        </nav>

        <Link
          href="/replay"
          className="label-mono rounded-sm border border-signal-red/40 bg-signal-red/10 px-4 py-2 text-xs font-medium text-signal-red transition hover:bg-signal-red/20"
        >
          EXPLORE DECISION
        </Link>
      </div>
    </header>
  );
}
