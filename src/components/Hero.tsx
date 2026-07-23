export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:px-8 md:pb-28 md:pt-32 lg:pt-40">
        <h1 className="font-display text-6xl leading-[0.92] tracking-tight text-black sm:text-7xl md:text-8xl lg:text-9xl">
          Sthlm Seven.
        </h1>
        <p className="mt-6 max-w-xl text-lg font-medium leading-snug text-slate-900 md:mt-8 md:text-xl">
          Stockholms mest exklusiva 7v7-turnering. Öppen amatörnivå för
          kompisgäng och korpenlag. 16 lag. En mästare.
        </p>
        <div className="mt-10 flex max-w-xl items-center justify-center gap-2.5 text-sm text-slate-500 md:mt-12 md:justify-start">
          <span>Powered by AllPlay</span>
          <img
            src="/allplay-logo.png"
            alt="AllPlay"
            className="h-7 w-auto object-contain"
          />
        </div>
      </div>
    </section>
  )
}
