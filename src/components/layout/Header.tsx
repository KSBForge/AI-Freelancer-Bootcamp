import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../../data/site'
import { scrollToId } from '../../lib/smooth'
import { useScrollY } from '../../lib/hooks'
import Logo from '../ui/Logo'
import { IconSearch, IconMenu, IconClose, IconArrowRight } from '../ui/icons'

export default function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const y = useScrollY()
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const scrolled = y > 40

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    const onScroll = () => {
      const pos = window.scrollY + window.innerHeight * 0.35
      let current = 'home'
      for (const s of sections) {
        if (s.offsetTop <= pos) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => scrollToId(href.slice(1)), open ? 150 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-700 ease-lux ${
          scrolled ? 'border-b border-white/[0.06] bg-[#080706]/85 py-3 backdrop-blur-xl' : 'bg-transparent py-5'
        }`}
      >
        <div className="container-lux flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className={`group relative text-[13.5px] tracking-wide transition-colors duration-300 ${
                  active === l.href.slice(1) ? 'text-gold' : 'text-ivory/75 hover:text-ivory'
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-2 left-1/2 h-px -translate-x-1/2 bg-gold transition-all duration-500 ease-lux ${
                    active === l.href.slice(1) ? 'w-full' : 'w-0 group-hover:w-1/2'
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              aria-label="Search menu and dishes"
              className="grid size-11 place-items-center rounded-full border border-white/10 text-ivory/85 transition-all duration-300 hover:border-gold/60 hover:text-gold"
            >
              <IconSearch width={19} height={19} />
            </button>
            <button
              onClick={() => scrollToId('reservation')}
              className="btn-gold hidden !px-6 !py-3 md:inline-flex"
            >
              Book a Table
              <IconArrowRight width={16} height={16} />
            </button>
            <button
              className="grid size-11 place-items-center rounded-full border border-white/10 text-ivory lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[65] flex flex-col bg-[#080706]/95 backdrop-blur-2xl transition-all duration-500 ease-lux lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="container-lux flex h-full flex-col justify-center gap-2 pt-16">
          {NAV_LINKS.map((l, i) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              style={{ transitionDelay: `${i * 40}ms` }}
              className={`border-b border-white/5 py-4 text-left font-display text-3xl text-ivory transition-all duration-500 ease-lux ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } hover:text-gold`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              scrollToId('reservation')
            }}
            className="btn-gold mt-8 w-full"
          >
            Book a Table
            <IconArrowRight width={16} height={16} />
          </button>
          <p className="mt-6 text-center text-xs tracking-wide text-ivory/40">+91 98765 43210 · Mon - Sun, 11:00 AM - 11:00 PM</p>
        </div>
      </div>
    </>
  )
}
