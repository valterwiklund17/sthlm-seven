export function Hero() {
  return (
    <section className="bg-night">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 md:px-8 md:pb-12 md:pt-24 lg:pt-28">
        <h1 className="animate-fade-up font-display text-5xl font-extrabold uppercase tracking-tight text-ink md:text-7xl">
          Sthlm Seven
        </h1>
        <p className="animate-fade-up-delay mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base md:mt-5">
          Gymnasiemästerskapet – Night Session. 7v7 på inomhuskonstgräs. 12
          gymnasieskolor. En mästare.
        </p>
        <div className="animate-fade-up-delay-2 mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-zinc-400">
            Tidigare slutsålda turneringar
          </span>
          <span className="inline-flex whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-zinc-400">
            Uppmärksammad i SportExpressen &amp; Mitt i
          </span>
        </div>
      </div>
    </section>
  )
}
