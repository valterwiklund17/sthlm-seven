import { Calendar, MapPin, Shield, Trophy, type LucideIcon } from 'lucide-react'

type SpecRow = {
  icon: LucideIcon
  title: string
  detail: string
}

const rows: SpecRow[] = [
  {
    icon: Calendar,
    title: '30 Januari 2027 · 19:00–01:00',
    detail: 'Lördagskväll · Insläpp från 18:30',
  },
  {
    icon: MapPin,
    title: 'Ultimate Football',
    detail: 'Upplands Väsby · Inomhuskonstgräs',
  },
  {
    icon: Shield,
    title: '7v7 Inomhus · 12 lag',
    detail: '3 grupper (8 till kvartsfinal) · 1×18 min',
  },
  {
    icon: Trophy,
    title: 'Prispott släpps snart',
    detail: 'Kontantpris & exklusiva sponsorpriser',
  },
]

export function InfoGrid() {
  return (
    <section className="bg-night">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-2 md:px-8 md:pb-14 md:pt-4">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111114]">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {rows.map(({ icon: Icon, title, detail }) => (
              <article
                key={title}
                className="flex items-start gap-3 border-b border-white/[0.07] px-4 py-3 last:border-b-0 sm:border-b-0 sm:px-5 sm:py-4 sm:odd:border-r sm:odd:border-white/[0.07] sm:[&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-white/[0.07]"
              >
                <Icon
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="font-display text-base font-bold uppercase leading-tight tracking-tight text-ink sm:text-lg">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-zinc-400 sm:text-[13px]">
                    {detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
