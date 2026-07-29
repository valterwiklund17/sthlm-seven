type Partner = {
  name: string
  href: string
  logoSrc: string
}

const footerTextClass = 'text-sm font-medium text-gray-500'

const partners: Partner[] = [
  {
    name: 'ViSes',
    href: 'https://apps.apple.com/se/app/vises-v%C3%A4nner-upplevelser/id6759677282',
    logoSrc: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assets/vises_logo.png`,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-8 md:px-8 md:py-10">
        {/* Level 1: Infrastructure — AllPlay */}
        <section className="flex w-full flex-col items-center gap-3 text-center">
          <div className={`flex items-center gap-2 ${footerTextClass}`}>
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
            className="inline-flex"
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
        <section className="mt-8 w-full border-t border-gray-100 pt-8">
          <h2 className={`text-center ${footerTextClass}`}>
            Officiella Partners
          </h2>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 md:max-w-2xl md:gap-8">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="flex h-20 w-32 flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2 md:h-24 md:w-36">
                  <img
                    src={partner.logoSrc}
                    alt={partner.name}
                    className="h-14 w-14 object-contain md:h-16 md:w-16"
                  />
                </div>
                <span className={`${footerTextClass} group-hover:text-gray-700`}>
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Level 3: Copyright */}
        <p className={`mt-8 text-center ${footerTextClass}`}>
          © {new Date().getFullYear()} Sthlm Seven. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  )
}
