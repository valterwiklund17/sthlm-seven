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
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-2 md:px-8 md:pb-20 md:pt-8">
        <div className="grid gap-2 md:grid-cols-3 md:gap-6">
          {cards.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="flex flex-row items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-col md:gap-0 md:p-6"
            >
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-black md:mb-5 md:mt-0 md:h-6 md:w-6"
                strokeWidth={1.75}
                aria-hidden
              />
              <div className="min-w-0">
                <h2 className="font-display text-base tracking-tight text-black md:text-xl">
                  {title}
                </h2>
                <p className="mt-1 text-sm leading-snug text-gray-600 md:mt-2 md:text-base md:leading-relaxed">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
