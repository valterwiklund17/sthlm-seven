type Partner = {
  name: string
  href: string
  logoSrc: string
}

const partners: Partner[] = [
  {
    name: 'ViSes',
    href: 'https://vises.se',
    logoSrc: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assets/vises_logo.png`,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 md:px-8 md:py-20">
        {/* Level 1: Infrastructure — AllPlay */}
        <section className="flex w-full flex-col items-center text-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 md:text-base">
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
            className="mt-4 inline-flex"
            aria-label="Hämta AllPlay i App Store"
          >
            <img
              src="/app-store-sv.png"
              alt="Hämta i App Store"
              className="h-10 w-auto object-contain transition-opacity hover:opacity-80 md:h-11"
            />
          </a>
        </section>

        {/* Level 2: Partners — scalable grid */}
        <section className="mt-14 w-full border-t border-gray-100 pt-14 md:mt-16 md:pt-16">
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Officiella Partners
          </h2>
          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 md:mt-10 md:max-w-2xl md:gap-10">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 md:h-20 md:w-32">
                  <img
                    src={partner.logoSrc}
                    alt={partner.name}
                    className="max-h-12 max-w-full object-contain md:max-h-14"
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Level 3: Copyright */}
        <p className="mt-14 text-center text-sm text-gray-500 md:mt-16">
          © {new Date().getFullYear()} Sthlm Seven. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  )
}
