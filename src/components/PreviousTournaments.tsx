type GalleryItem = {
  path: string
  label: string
  isWinner?: boolean
  objectPosition?: string
}

const items: GalleryItem[] = [
  {
    path: 'SthlmSeven-PK-Zinken034.jpeg',
    label: 'GYMNASIEMÄSTERSKAPET · ZINKENSDAMMS IP (19 SEP)',
  },
  {
    path: 'SthlmSeven-PK-Zinken095.jpeg',
    label: 'VINNARE: SPIRA TEORETISKA GYMNASIUM · ZINKENSDAMMS IP',
    isWinner: true,
    objectPosition: 'object-[center_25%]',
  },
  {
    path: 'IMG_0477.jpeg',
    label: 'STHLM SEVEN · ÄRVINGE BP (30 AUG)',
  },
  {
    path: 'IMG_1236.jpeg',
    label: 'VINNARE: KTH FC · ÄRVINGE BP',
    isWinner: true,
    objectPosition: 'object-[center_25%]',
  },
]

function assetUrl(filename: string) {
  const base = import.meta.env.VITE_SUPABASE_URL
  return `${base}/storage/v1/object/public/assets/${filename}`
}

export function PreviousTournaments() {
  return (
    <section className="bg-night">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-2 md:px-8 md:pb-16">
        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink md:text-3xl">
          Tidigare turneringar
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:mt-8 md:gap-4">
          {items.map((item) => (
            <article
              key={item.path}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/8 bg-surface"
            >
              <img
                src={assetUrl(item.path)}
                alt={item.label}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${item.objectPosition ?? 'object-center'}`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              />
              {item.isWinner ? (
                <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black md:left-4 md:top-4 md:text-[11px]">
                  Vinnare
                </span>
              ) : null}
              <p className="absolute inset-x-0 bottom-0 p-3 text-[11px] font-semibold uppercase leading-snug tracking-[0.06em] text-white md:p-4 md:text-xs">
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
