import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60'

export function RegistrationSection() {
  const [teamName, setTeamName] = useState('')
  const [captain, setCaptain] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    const { data, error } = await supabase
      .from('teams')
      .insert({
        team_name: teamName,
        captain_name: captain,
        email: email,
      })
      .select()

    if (error) {
      setErrorMsg('Något gick fel vid anmälan. Försök igen.')
      setIsSubmitting(false)
      return
    }

    const teamId = data?.[0]?.id
    if (!teamId) {
      setErrorMsg('Något gick fel vid anmälan. Försök igen.')
      setIsSubmitting(false)
      return
    }

    const stripeUrl = `https://buy.stripe.com/test_dRmaEZfDgf8Egq5ang6kg00?client_reference_id=${teamId}`
    window.location.href = stripeUrl
  }

  return (
    <section id="anmalan" className="px-6 pb-24 pt-8 md:px-8 md:pb-32 md:pt-12">
      <div className="mx-auto max-w-xl">
        <h2 className="font-display text-3xl tracking-tight text-black md:text-4xl">
          Anmäl ditt lag
        </h2>
        <p className="mt-4 text-base text-slate-900 md:text-lg">
          Begränsat till 16 lag. Anmälningsavgift 1000&nbsp;kr.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
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
              required
              disabled={isSubmitting}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className={inputClassName}
              placeholder="Ditt lags namn"
            />
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
              required
              disabled={isSubmitting}
              value={captain}
              onChange={(e) => setCaptain(e.target.value)}
              className={inputClassName}
              placeholder="Fullständigt namn"
            />
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
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
              placeholder="namn@email.se"
            />
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
    </section>
  )
}
