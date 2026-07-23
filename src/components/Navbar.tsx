type NavbarProps = {
  hideCta?: boolean
}

export function Navbar({ hideCta = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:px-8 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="/"
            className="inline-flex items-center"
            aria-label="STHLM SEVEN"
          >
            <img
              src="/sthlmsevenlogo.jpg"
              alt="STHLM SEVEN"
              className="h-11 w-auto object-contain md:h-14"
            />
          </a>
          {!hideCta && (
            <a
              href="#anmalan"
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Anmäl lag
            </a>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 md:gap-2 md:text-xs">
            <span className="leading-none">Powered by AllPlay</span>
            <img
              src="/allplay-logo.png"
              alt="AllPlay"
              className="h-4 w-auto object-contain md:h-5"
            />
          </div>
          <a
            href="https://getallplay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
            aria-label="Ladda ner AllPlay i App Store"
          >
            <img
              src="https://mukmpfrvtiiebzpmjpwg.supabase.co/storage/v1/object/public/assets/app-store-sv.png"
              alt="Ladda ner i App Store"
              className="h-8 w-auto object-contain transition-opacity hover:opacity-80 md:h-10"
            />
          </a>
        </div>
      </nav>
    </header>
  )
}
