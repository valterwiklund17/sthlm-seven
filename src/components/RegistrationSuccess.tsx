import { CheckCircle } from 'lucide-react'

export function RegistrationSuccess() {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-white/8 bg-surface p-10 md:p-14">
      <CheckCircle
        className="mb-6 h-12 w-12 text-accent"
        strokeWidth={1.75}
        aria-hidden
      />
      <h1 className="font-display text-4xl uppercase tracking-tight text-ink md:text-5xl">
        Tack för din anmälan!
      </h1>
      <p className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg">
        Din betalning är genomförd och ditt lag är nu registrerat för Sthlm
        Seven High School Edition. Vi ses på Zinkensdamms IP.
      </p>
      <a
        href="/"
        className="mt-10 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#ffaa1a]"
      >
        Tillbaka till startsidan
      </a>
    </div>
  )
}
