import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { InfoGrid } from './components/InfoGrid'
import { RegistrationSection } from './components/RegistrationSection'
import { RegistrationSuccess } from './components/RegistrationSuccess'

function App() {
  const isSuccess =
    new URLSearchParams(window.location.search).get('success') === 'true'

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar hidePartner={isSuccess} />
      <main className="flex flex-1 flex-col">
        {isSuccess ? (
          <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12 md:px-8">
            <RegistrationSuccess />
          </div>
        ) : (
          <>
            <Hero />
            <div className="bg-slate-50">
              <InfoGrid />
              <RegistrationSection />
            </div>
          </>
        )}
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-sm tracking-tight text-black">
            STHLM SEVEN
          </p>
          <p className="text-sm text-slate-900">
            © {new Date().getFullYear()} Sthlm Seven. Alla rättigheter förbehållna.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
