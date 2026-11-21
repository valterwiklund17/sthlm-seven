type GalleryItem = {
  path: string
  title: string
  subtitle: string
  isWinner?: boolean
  objectPosition?: string
}

const items: GalleryItem[] = [
  {
    path: 'SthlmSeven-PK-Zinken034.jpeg',
    title: 'Gymnasiemästerskapet',
    subtitle: 'Zinkensdamms IP · 19 sep',
  },
  {
    path: 'SthlmSeven-PK-Zinken095.jpeg',
    title: 'Spira Teoretiska',
    subtitle: 'Zinkensdamms IP · 19 sep',
    isWinner: true,
    objectPosition: 'object-[center_20%]',
  },
  {
    path: 'IMG_0477.jpeg',
    title: 'Sommarturneringen',
    subtitle: 'Ärvinge BP · 30 aug',
  },
  {
    path: 'IMG_1236.jpeg',
    title: 'KTH FC',
    subtitle: 'Ärvinge BP · 30 aug',
    isWinner: true,
    objectPosition: 'object-[center_20%]',
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
              className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111114]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={assetUrl(item.path)}
                  alt={item.title}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02] ${item.objectPosition ?? 'object-center'}`}
                />
              </div>
              <div className="p-2.5 sm:p-3">
                {item.isWinner ? (
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Vinnare
                  </p>
                ) : null}
                <h3 className="font-display text-base font-bold uppercase leading-tight tracking-tight text-ink sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-zinc-400 sm:text-xs">
                  {item.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
