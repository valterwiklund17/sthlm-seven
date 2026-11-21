export function Hero() {
  return (
    <section className="relative overflow-hidden bg-night">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(252,150,6,0.12),_transparent_55%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 md:px-8 md:pb-12 md:pt-24 lg:pt-28">
        <h1 className="animate-fade-up font-display text-5xl font-extrabold uppercase tracking-tight text-ink md:text-7xl">
          Sthlm Seven
        </h1>
        <p className="animate-fade-up-delay mt-4 max-w-xl text-lg leading-snug text-muted md:mt-6">
          Sthlm Seven presenterar: Gymnasiemästerskapet – Night Session.
          Stockholms mest exklusiva 7v7-nattcup inomhus på konstgräs för
          skollag. 12 gymnasieskolor. En mästare.
        </p>
        <p className="animate-fade-up-delay-2 mt-6 text-xs font-medium tracking-wide text-muted/80 md:text-sm">
          Tidigare slutsålda turneringar
          <span className="mx-2 text-white/20" aria-hidden>
            ·
          </span>
          Uppmärksammad i SportExpressen &amp; Mitt i
        </p>
      </div>
    </section>
  )
}
