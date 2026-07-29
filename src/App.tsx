import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { InfoGrid } from './components/InfoGrid'
import { RegistrationSection } from './components/RegistrationSection'
import { RegistrationSuccess } from './components/RegistrationSuccess'
import { Footer } from './components/Footer'

function App() {
  const isSuccess =
    new URLSearchParams(window.location.search).get('success') === 'true'

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar hideCta={isSuccess} />
      <main className="flex flex-1 flex-col">
        {isSuccess ? (
          <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12 md:px-8">
            <RegistrationSuccess />
          </div>
        ) : (
          <>
            <Hero />
            <InfoGrid />
            <RegistrationSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
