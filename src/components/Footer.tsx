type Partner = {
  name: string
  href: string
  logoSrc: string
}

const footerTextClass = 'text-sm font-medium text-muted'

const partners: Partner[] = [
  {
    name: 'ViSes',
    href: 'https://apps.apple.com/se/app/vises-v%C3%A4nner-upplevelser/id6759677282',
    logoSrc: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assets/vises_logo.png`,
  },
  // Temporarily hidden until a new EF Education First agreement is signed.
  // {
  //   name: 'EF Education First',
  //   href: 'https://www.ef.se',
  //   logoSrc: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assets/${encodeURIComponent('JPG-EF-Logos_EF Education First Black-Photoroom.png')}`,
  // },
]

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-night">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-6 md:px-8 md:py-8">
        <section className="flex w-full flex-col items-center gap-2.5 text-center md:gap-3">
          <div className={`flex items-center gap-2 ${footerTextClass}`}>
            <span>Powered by AllPlay</span>
            <span className="inline-flex rounded-md bg-white px-1.5 py-1">
              <img
                src="/allplay-logo.png"
                alt="AllPlay"
                className="h-5 w-auto object-contain md:h-6"
              />
            </span>
          </div>
          <a
            href="https://getallplay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
            aria-label="Hämta AllPlay i App Store"
          >
            <img
              src="/app-store-sv.png"
              alt="Hämta i App Store"
              className="h-9 w-auto object-contain transition-opacity hover:opacity-80 md:h-10"
            />
          </a>
        </section>

        <section className="mt-5 w-full border-t border-white/8 pt-5 md:mt-6 md:pt-6">
          <h2 className={`text-center ${footerTextClass}`}>
            Officiella Partners
          </h2>
          <div className="mx-auto mt-4 flex max-w-md flex-wrap items-start justify-center gap-x-10 gap-y-4 md:mt-5 md:gap-x-14">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-32 flex-col items-center transition-opacity hover:opacity-80"
              >
                <span className="inline-flex min-h-14 items-center justify-center rounded-lg bg-white px-3 py-2">
                  <img
                    src={partner.logoSrc}
                    alt={partner.name}
                    className="h-10 w-auto object-contain md:h-12"
                  />
                </span>
                <span
                  className={`mt-2 text-center ${footerTextClass} group-hover:text-ink`}
                >
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        <p className={`mt-5 text-center text-xs md:mt-6 ${footerTextClass}`}>
          © 2026–2027 Sthlm Seven. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  )
}
