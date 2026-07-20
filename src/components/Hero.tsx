export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:px-8 md:pb-28 md:pt-32 lg:pt-40">
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl">
          Sthlm Seven.
        </h1>
        <p className="mt-6 max-w-xl text-lg font-medium leading-snug text-slate-900 md:mt-8 md:text-xl">
          Stockholms mest exklusiva 7v7-turnering. 16 lag. En mästare.
        </p>
        <a
          href="#anmalan"
          className="mt-10 inline-block bg-amber-500 px-8 py-4 text-base font-semibold text-slate-900 transition-opacity hover:opacity-90 md:mt-12 md:text-lg"
        >
          Anmäl ditt lag (1000&nbsp;kr)
        </a>
      </div>
    </section>
  )
}
