import { CheckCircle } from 'lucide-react'

export function RegistrationSuccess() {
  return (
    <div className="w-full max-w-2xl rounded-xl border border-transparent bg-white p-10 shadow-md md:p-14">
      <CheckCircle
        className="mb-6 h-12 w-12 text-amber-500"
        strokeWidth={1.75}
        aria-hidden
      />
      <h1 className="font-display text-4xl tracking-tight text-black md:text-5xl">
        Tack för din anmälan!
      </h1>
      <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-900 md:text-lg">
        Din betalning är genomförd och ditt lag är nu registrerat för Sthlm
        Seven. Vi ses på Zinkensdamms IP.
      </p>
      <a
        href="/"
        className="mt-10 inline-block rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
      >
        Tillbaka till startsidan
      </a>
    </div>
  )
}
