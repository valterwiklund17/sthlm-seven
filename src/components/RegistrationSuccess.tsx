import { CheckCircle } from 'lucide-react'
import {
  MAX_TEAMS,
  TOURNAMENT_DATE_LABEL,
  TOURNAMENT_DOORS_LABEL,
  TOURNAMENT_NAME,
  TOURNAMENT_TIME_LABEL,
  TOURNAMENT_VENUE_CITY,
  TOURNAMENT_VENUE_DETAIL,
  TOURNAMENT_VENUE_NAME,
} from '../lib/tournament'

export function RegistrationSuccess() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-white/10 border-t-2 border-t-accent bg-[#111114] p-8 md:p-10">
      <CheckCircle
        className="mb-5 h-10 w-10 text-accent md:mb-6 md:h-11 md:w-11"
        strokeWidth={1.75}
        aria-hidden
      />
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink md:text-4xl">
        Tack för din anmälan!
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-[15px]">
        Din betalning är genomförd och ditt lag är nu registrerat för Sthlm
        Seven – {TOURNAMENT_NAME}. En av de {MAX_TEAMS} platserna är säkrad.
      </p>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
        <p className="font-display text-[13px] font-bold uppercase tracking-wider text-zinc-300">
          När &amp; var
        </p>
        <dl className="space-y-2 text-sm text-zinc-400">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="min-w-16 font-medium text-zinc-200">Datum</dt>
            <dd>{TOURNAMENT_DATE_LABEL}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="min-w-16 font-medium text-zinc-200">Tid</dt>
            <dd>
              {TOURNAMENT_TIME_LABEL} · {TOURNAMENT_DOORS_LABEL}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="min-w-16 font-medium text-zinc-200">Plats</dt>
            <dd>
              {TOURNAMENT_VENUE_NAME}, {TOURNAMENT_VENUE_CITY} ·{' '}
              {TOURNAMENT_VENUE_DETAIL}
            </dd>
          </div>
        </dl>
      </div>

      <a
        href="/"
        className="mt-8 inline-flex rounded-lg bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-black transition-[filter] hover:brightness-110"
      >
        Tillbaka till startsidan
      </a>
    </div>
  )
}
