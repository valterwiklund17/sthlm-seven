import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const inputClassName =
  'h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-base text-slate-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60 md:h-12 md:px-4'

const inputErrorClassName =
  'h-11 w-full rounded-lg border border-red-300 bg-white px-3.5 text-base text-slate-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60 md:h-12 md:px-4'

const REQUIRED_FIELD_MSG = 'Detta fält är obligatoriskt'
const CHECKBOX_MSG = 'Du måste godkänna villkoren för att fortsätta'
const TOURNAMENT_FULL_MSG =
  'Maxgränsen på 8 lag är nådd. Turneringen är full.'

type FieldErrors = {
  teamName?: string
  captain?: string
  phone?: string
  email?: string
  termsAccepted?: string
}

export function RegistrationSection() {
  const [teamName, setTeamName] = useState('')
  const [captain, setCaptain] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTournamentFull, setIsTournamentFull] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    let cancelled = false

    async function checkCapacity() {
      const { count, error } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })

      if (cancelled) return

      if (error) {
        console.error('[registration] Failed to count teams:', error)
        return
      }

      if ((count ?? 0) >= 8) {
        setIsTournamentFull(true)
        setErrorMsg(TOURNAMENT_FULL_MSG)
      }
    }

    void checkCapacity()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isTermsOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsTermsOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isTermsOpen])

  function validate(): boolean {
    const nextErrors: FieldErrors = {}

    if (!teamName.trim()) nextErrors.teamName = REQUIRED_FIELD_MSG
    if (!captain.trim()) nextErrors.captain = REQUIRED_FIELD_MSG
    if (!phone.trim()) nextErrors.phone = REQUIRED_FIELD_MSG
    if (!email.trim()) nextErrors.email = REQUIRED_FIELD_MSG
    if (!termsAccepted) nextErrors.termsAccepted = CHECKBOX_MSG

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMsg('')

    if (isTournamentFull) {
      setErrorMsg(TOURNAMENT_FULL_MSG)
      return
    }

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_name: teamName,
          captain_name: captain,
          email,
          phone,
        }),
      })

      const payload = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !payload.url) {
        const message =
          payload.error || 'Något gick fel vid anmälan. Försök igen.'
        setErrorMsg(message)
        if (
          message.includes('full') ||
          message.includes('Maxgränsen') ||
          message.includes('fullbokad')
        ) {
          setIsTournamentFull(true)
        }
        setIsSubmitting(false)
        return
      }

      window.location.href = payload.url
    } catch {
      setErrorMsg('Något gick fel vid anmälan. Försök igen.')
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="anmalan"
      className="scroll-mt-24 border-t border-gray-200 bg-slate-50 px-4 pt-10 pb-6 md:scroll-mt-28 md:px-8 md:pt-12 md:pb-8"
    >
      <div className="mx-auto max-w-xl">
        <h2 className="font-display text-3xl font-bold tracking-tight text-black">
          Anmäl ditt lag
        </h2>
        <p className="mt-2 text-base text-gray-600">
          Begränsat till 8 lag. Anmälningsavgift 1500&nbsp;kr.
        </p>

        <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-3 md:mt-8 md:space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="lagnamn"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Lagnamn
            </label>
            <input
              id="lagnamn"
              name="lagnamn"
              type="text"
              disabled={isSubmitting}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value)
                if (fieldErrors.teamName) {
                  setFieldErrors((prev) => ({ ...prev, teamName: undefined }))
                }
              }}
              aria-invalid={Boolean(fieldErrors.teamName)}
              className={fieldErrors.teamName ? inputErrorClassName : inputClassName}
              placeholder="Ditt lags namn"
            />
            {fieldErrors.teamName && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.teamName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lagkapten"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Lagkapten
            </label>
            <input
              id="lagkapten"
              name="lagkapten"
              type="text"
              disabled={isSubmitting}
              value={captain}
              onChange={(e) => {
                setCaptain(e.target.value)
                if (fieldErrors.captain) {
                  setFieldErrors((prev) => ({ ...prev, captain: undefined }))
                }
              }}
              aria-invalid={Boolean(fieldErrors.captain)}
              className={fieldErrors.captain ? inputErrorClassName : inputClassName}
              placeholder="Fullständigt namn"
            />
            {fieldErrors.captain && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.captain}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefonnummer"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Telefonnummer
            </label>
            <input
              id="telefonnummer"
              name="telefonnummer"
              type="tel"
              disabled={isSubmitting}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (fieldErrors.phone) {
                  setFieldErrors((prev) => ({ ...prev, phone: undefined }))
                }
              }}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={fieldErrors.phone ? inputErrorClassName : inputClassName}
              placeholder="07X-XXX XX XX"
            />
            {fieldErrors.phone && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              disabled={isSubmitting}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              className={fieldErrors.email ? inputErrorClassName : inputClassName}
              placeholder="namn@email.se"
            />
            {fieldErrors.email && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id="terms-accepted"
                name="terms-accepted"
                type="checkbox"
                disabled={isSubmitting}
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked)
                  if (fieldErrors.termsAccepted) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      termsAccepted: undefined,
                    }))
                  }
                }}
                aria-invalid={Boolean(fieldErrors.termsAccepted)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-amber-500 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm leading-relaxed text-slate-900">
                Jag intygar att samtliga spelare går på gymnasiet och jag godkänner{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsTermsOpen(true)
                  }}
                  className="font-semibold text-slate-900 underline underline-offset-2 transition-colors hover:text-amber-600"
                >
                  anmälningsvillkoren
                </button>
                .
              </span>
            </label>
            {fieldErrors.termsAccepted && (
              <p className="mt-2 text-sm text-red-600">
                {fieldErrors.termsAccepted}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isTournamentFull}
            className="w-full rounded-lg bg-amber-500 px-8 py-4 text-base font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {isSubmitting ? 'Behandlar...' : 'Gå till betalning (1500 kr)'}
          </button>
        </form>
      </div>

      {isTermsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="presentation"
          onClick={() => setIsTermsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 pb-4 pt-6 md:px-8">
              <h3
                id="terms-modal-title"
                className="pr-8 font-display text-2xl tracking-tight text-black"
              >
                Anmälningsvillkor
              </h3>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Stäng"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="max-h-[70vh] flex-1 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-slate-900 md:px-8 md:text-base">
              <section className="space-y-2">
                <h4 className="font-bold text-black">
                  1. Anmälan och Betalning
                </h4>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Anmälan är bindande.</li>
                  <li>
                    Den fasta anmälningsavgiften återbetalas ej vid avhopp,
                    ånger eller om laget diskvalificeras från turneringen.
                  </li>
                </ul>
              </section>

              <section className="mt-6 space-y-2">
                <h4 className="font-bold text-black">2. Ansvarsfriskrivning</h4>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Allt deltagande sker helt på egen risk.</li>
                  <li>
                    Sthlm Seven bär inget ekonomiskt eller juridiskt ansvar för
                    eventuella personskador, sjukdomsfall, eller för
                    stulna/borttappade värdesaker i samband med turneringen.
                  </li>
                </ul>
              </section>

              <section className="mt-6 space-y-2">
                <h4 className="font-bold text-black">
                  3. Lagkaptenens ansvar
                </h4>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    Varje lag ska utse en ansvarig person som fungerar som
                    exklusiv kontaktperson gentemot arrangören.
                  </li>
                  <li>
                    Denna person ansvarar för att all information och alla
                    regelverk kommuniceras till samtliga spelare i laget.
                  </li>
                </ul>
              </section>

              <section className="mt-6 space-y-2">
                <h4 className="font-bold text-black">
                  4. Spelregler &amp; Format
                </h4>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    Turneringarna spelas i 7v7-format och följer i grunden
                    Svenska Fotbollförbundets (SvFF) regelverk.
                  </li>
                  <li>
                    För spelarnas säkerhet är defensiva glidtacklingar
                    förbjudna.
                  </li>
                  <li>
                    Vid regelbrott tillämpas gula och röda kort. Vid grova
                    eller upprepade överträdelser kan hela laget
                    diskvalificeras från turneringen.
                  </li>
                </ul>
              </section>

              <section className="mt-6 space-y-2 pb-2">
                <h4 className="font-bold text-black">
                  5. Disciplin, Supportrar och Fair Play
                </h4>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    Alla förväntas bidra till en trygg och respektfull miljö.
                    Varje lag ansvarar strikt för både sina egna spelare och
                    sina supportrar.
                  </li>
                  <li>
                    Kränkande, hotfullt eller våldsamt beteende leder till
                    omedelbar avvisning från spelplatsen.
                  </li>
                  <li>
                    Pyroteknik (bengaler, fyrverkerier etc.) är strängt
                    förbjudet på och i anslutning till spelplatsen.
                    Överträdelser från spelare eller supportrar leder till att
                    laget diskvalificeras omedelbart.
                  </li>
                </ul>
              </section>
            </div>

            <div className="sticky bottom-0 border-t border-gray-100 bg-white px-6 py-4 md:px-8">
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="w-full rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
