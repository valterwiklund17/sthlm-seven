import { MapPin, Shield, Trophy, type LucideIcon } from 'lucide-react'

type InfoCard = {
  icon: LucideIcon
  title: string
  description: string
}

const cards: InfoCard[] = [
  {
    icon: MapPin,
    title: '14 Augusti, 09:00 - 16:00',
    description: 'Mälarhöjdens IP.',
  },
  {
    icon: Shield,
    title: '7v7 Format',
    description: '4 grupper. 15 min gruppspel, 20 min slutspel. Officiella domare.',
  },
  {
    icon: Trophy,
    title: 'Vinnaren tar allt',
    description: '2500 kr i garanterad prispott.',
  },
]

export function InfoGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-4 md:px-8 md:pb-20 md:pt-28">
      <div className="grid gap-2 md:grid-cols-3 md:gap-8">
        {cards.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="flex flex-row items-start gap-3 rounded-xl border border-transparent bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:flex-col md:gap-0 md:p-8"
          >
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0 text-slate-900 md:mb-6 md:mt-0 md:h-6 md:w-6"
              strokeWidth={1.75}
              aria-hidden
            />
            <div className="min-w-0">
              <h2 className="font-display text-base tracking-tight text-black md:text-xl">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-snug text-slate-900 md:mt-3 md:text-base md:leading-relaxed">
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
