export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-night">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-6 md:px-8 md:py-7">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
          <span>Powered by AllPlay</span>
          <img
            src="/allplay-logo.png"
            alt="AllPlay"
            className="h-6 w-auto object-contain md:h-7"
          />
        </div>

        <a
          href="https://getallplay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex"
          aria-label="Hämta AllPlay i App Store"
        >
          <img
            src="/app-store-sv.png"
            alt="Hämta i App Store"
            className="h-9 w-auto object-contain transition-opacity hover:opacity-80 md:h-10"
          />
        </a>

        <div className="mt-5 w-full max-w-xs border-t border-white/10 pt-4 text-center">
          <p className="text-xs font-medium text-zinc-500">
            © 2026–2027 Sthlm Seven. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  )
}
