type NavbarProps = {
  hideCta?: boolean
}

export function Navbar({ hideCta = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8">
        <a href="/" className="inline-flex items-center" aria-label="STHLM SEVEN">
          <img
            src="/sthlmsevenlogo.jpg"
            alt="STHLM SEVEN"
            className="h-12 w-auto object-contain md:h-14"
          />
        </a>
        {!hideCta && (
          <a
            href="#anmalan"
            className="bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
          >
            Anmäl lag
          </a>
        )}
      </nav>
    </header>
  )
}
