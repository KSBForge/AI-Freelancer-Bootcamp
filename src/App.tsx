import { useState, useEffect } from 'react'
import { prefersReducedMotion } from './lib/hooks'
import { initSmoothScroll } from './lib/smooth'
import CustomCursor from './components/ui/CustomCursor'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import Footer from './components/layout/Footer'
import SearchOverlay from './components/overlays/SearchOverlay'

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    initSmoothScroll()
  }, [])

  return (
    <div className="min-h-screen bg-[#080706] text-ivory">
      <CustomCursor />
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <main>
        <Hero />
      </main>
      <Footer />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
