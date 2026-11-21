type NavbarProps = {
  hideCta?: boolean
}

const logoSrc = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assets/Photoroom_20260917_120540.png`

export function Navbar({ hideCta = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-night/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-8 md:py-3">
        <a href="/" className="inline-flex items-center" aria-label="STHLM SEVEN">
          <img
            src={logoSrc}
            alt="STHLM SEVEN"
            className="h-11 w-auto object-contain md:h-14"
          />
        </a>
        {!hideCta && (
          <a
            href="#anmalan"
            className="rounded-md bg-accent px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-black transition-colors hover:brightness-110"
          >
            Anmäl lag
          </a>
        )}
      </nav>
    </header>
  )
}
