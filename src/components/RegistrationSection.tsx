import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60'

const inputErrorClassName =
  'w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60'

const REQUIRED_FIELD_MSG = 'Detta fält är obligatoriskt'
const CHECKBOX_MSG = 'Du måste godkänna villkoren för att fortsätta'

const TERMS_TEXT =
  'Anmälan är bindande. Den fasta anmälningsavgiften på 1000 kr per lag återbetalas ej vid avhopp eller ånger. Deltagande sker helt på egen risk. Sthlm Seven ansvarar inte för eventuella personskador, och tar inget ansvar för stulna eller borttappade värdesaker under turneringen.'

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
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

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
        setErrorMsg(payload.error || 'Något gick fel vid anmälan. Försök igen.')
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
    <section id="anmalan" className="px-6 pb-24 pt-8 md:px-8 md:pb-32 md:pt-12">
      <div className="mx-auto max-w-xl">
        <h2 className="font-display text-2xl tracking-tight text-black md:text-3xl">
          Anmäl ditt lag
        </h2>
        <p className="mt-4 text-base text-slate-900 md:text-lg">
          Begränsat till 16 lag. Anmälningsavgift 1000&nbsp;kr.
        </p>

        <form noValidate onSubmit={handleSubmit} className="mt-10 space-y-6">
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
                Jag intygar att snittåldern i laget är 16+ och jag godkänner{' '}
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
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-500 px-8 py-4 text-base font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {isSubmitting ? 'Behandlar...' : 'Gå till betalning (1000 kr)'}
          </button>
        </form>
      </div>

      {isTermsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          role="presentation"
          onClick={() => setIsTermsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
            className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsTermsOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Stäng"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <h3
              id="terms-modal-title"
              className="font-display text-2xl tracking-tight text-black"
            >
              Anmälningsvillkor
            </h3>
            <p className="mt-4 text-base leading-relaxed text-slate-900">
              {TERMS_TEXT}
            </p>
            <button
              type="button"
              onClick={() => setIsTermsOpen(false)}
              className="mt-8 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
