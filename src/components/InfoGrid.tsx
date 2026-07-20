import { MapPin, Shield, Trophy, type LucideIcon } from 'lucide-react'

type InfoCard = {
  icon: LucideIcon
  title: string
  description: string
}

const cards: InfoCard[] = [
  {
    icon: MapPin,
    title: '22–24 Augusti',
    description: 'Zinkensdamms IP.',
  },
  {
    icon: Shield,
    title: '7v7 Format',
    description: 'Gruppspel & Slutspel. Officiella domare.',
  },
  {
    icon: Trophy,
    title: 'Vinnaren tar allt',
    description: 'Prestigefylld prispott.',
  },
]

export function InfoGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:px-8 md:pb-20 md:pt-28">
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {cards.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="rounded-xl border border-transparent bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Icon
              className="mb-6 h-6 w-6 text-slate-900"
              strokeWidth={1.75}
              aria-hidden
            />
            <h2 className="font-display text-xl tracking-tight text-black md:text-2xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-900">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
