import { useCallback, useEffect, useState } from 'react'
import { initSmoothScroll, ScrollTrigger } from './lib/smooth'
import CustomCursor from './components/ui/CustomCursor'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Properties from './components/sections/Properties'
import VillaExplorer from './components/sections/VillaExplorer'
import Trust from './components/sections/Trust'
import Services from './components/sections/Services'
import HowItWorks from './components/sections/HowItWorks'
import About from './components/sections/About'
import Impact from './components/sections/Impact'
import Vision from './components/sections/Vision'
import Amenities from './components/sections/Amenities'
import Testimonials from './components/sections/Testimonials'
import Locations from './components/sections/Locations'
import IndiaMap from './components/sections/IndiaMap'
import PropertyMatcher from './components/sections/PropertyMatcher'
import Contact from './components/sections/Contact'
import LeadForm from './components/sections/LeadForm'
import Newsletter from './components/sections/Newsletter'
import SearchOverlay from './components/overlays/SearchOverlay'
import StoryModal from './components/overlays/StoryModal'
import VisitModal from './components/overlays/VisitModal'
import PropertyModal from './components/PropertyModal'
import { prefersReducedMotion } from './lib/hooks'

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['oceanview-villa']))

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 4200)
  }, [])

  const openSchedule = useCallback(() => setVisitOpen(true), [])

  // Smooth scrolling + global parallax for [data-parallax] layers
  useEffect(() => {
    initSmoothScroll()
    if (prefersReducedMotion()) return

    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    const cleanups: Array<() => void> = []
    layers.forEach((layer) => {
      const st = ScrollTrigger.create({
        trigger: layer.parentElement ?? layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          layer.style.transform = `translate3d(0, ${(self.progress * 2 - 1) * 46}px, 0)`
        },
      })
      cleanups.push(() => st.kill())
    })
    return () => cleanups.forEach((c) => c())
  }, [])

  const toggleFav = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <div className="min-h-screen bg-ink text-ivory">
      <CustomCursor />

      <Navbar onOpenSearch={() => setSearchOpen(true)} onSchedule={openSchedule} />

      <main>
        <Hero onWatchStory={() => setStoryOpen(true)} />
        <Properties
          favorites={favorites}
          onToggleFav={toggleFav}
          onOpenProperty={setPropertyId}
          onSchedule={openSchedule}
        />
        <VillaExplorer />
        <Trust />
        <Services />
        <HowItWorks />
        <About onWatchStory={() => setStoryOpen(true)} />
        <Impact />
        <Vision />
        <Amenities />
        <Testimonials />
        <Locations onExplore={(city) => notify(`${city} collection coming soon — enquire below for early access.`)} />
        <IndiaMap onExplore={(city) => notify(`${city} collection coming soon — enquire below for early access.`)} />
        <PropertyMatcher onOpenProperty={setPropertyId} />
        <Contact onSchedule={openSchedule} />
        <LeadForm onNotify={notify} />
        <Newsletter />
      </main>

      <Footer />

      {/* Overlays */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpenProperty={setPropertyId} />
      <StoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
      <VisitModal open={visitOpen} onClose={() => setVisitOpen(false)} onNotify={notify} />
      <PropertyModal
        id={propertyId}
        onClose={() => setPropertyId(null)}
        onSchedule={() => setVisitOpen(true)}
      />

      {/* Mobile sticky CTA */}
      <button
        onClick={openSchedule}
        className="btn-gold fixed inset-x-4 bottom-4 z-[60] shadow-lux sm:hidden"
      >
        Schedule a Visit
      </button>

      {/* Toast */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed left-1/2 top-6 z-[95] -translate-x-1/2 transition-all duration-500 ease-lux ${
          toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        {toast && (
          <div className="glass-gold flex items-center gap-3 rounded-full px-5 py-3 text-sm text-ivory shadow-lux">
            <span className="size-2 rounded-full bg-gold" />
            {toast}
          </div>
        )}
      </div>
    </div>
  )
}
