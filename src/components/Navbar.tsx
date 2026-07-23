type NavbarProps = {
  hidePartner?: boolean
}

export function Navbar({ hidePartner = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-8 md:py-3">
        <a href="/" className="inline-flex items-center" aria-label="STHLM SEVEN">
          <img
            src="/sthlmsevenlogo.jpg"
            alt="STHLM SEVEN"
            className="h-11 w-auto object-contain md:h-16"
          />
        </a>
        {!hidePartner && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 md:gap-2 md:text-sm">
            <span className="leading-none">Powered by AllPlay</span>
            <img
              src="/allplay-logo.png"
              alt="AllPlay"
              className="h-5 w-auto object-contain md:h-7"
            />
          </div>
        )}
      </nav>
    </header>
  )
}
