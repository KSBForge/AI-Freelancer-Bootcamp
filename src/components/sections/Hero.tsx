import { useEffect, useRef, useState } from 'react'
import { scrollToId } from '../../lib/smooth'
import { prefersReducedMotion, isTouch } from '../../lib/hooks'
import { IconArrowRight } from '../ui/icons'
import { BRAND } from '../../data/site'

const HERO_ACCREDIT = {
  headlineLines: ['Where Every', 'Meal Becomes', 'a Memory'],
  sub: "At SAVORÉ, we blend world-class ingredients,\ncelebratory artistry, and a warm atmosphere to\ncreate unforgettable dining experiences.",
  script: ["Good Food", "Brighter", "Moments"],
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120)
    return () => clearTimeout(t)
  }, [])

  // Mouse-driven 3D parallax on layered hero scene
  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return
    const root = rootRef.current
    if (!root) return
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      tx = (e.clientX - r.left) / r.width - 0.5
      ty = (e.clientY - r.top) / r.height - 0.5
    }
    const loop = () => {
      cx += (tx - cx) * 0.05
      cy += (ty - cy) * 0.05
      const layers = root.querySelectorAll<HTMLElement>('[data-depth]')
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth || '0')
        l.style.transform = `translate3d(${(-cx * d * 60).toFixed(2)}px, ${(-cy * d * 34).toFixed(2)}px, 0)`
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Scroll parallax: background drifts, content fades
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const bg = rootRef.current?.querySelector<HTMLElement>('[data-hero-bg]')
        const content = rootRef.current?.querySelector<HTMLElement>('[data-hero-content]')
        if (bg && y < window.innerHeight * 1.2) {
          bg.style.transform = `translate3d(0, ${(y * 0.24).toFixed(1)}px, 0) scale(${1 + Math.min(y / 9000, 0.12)})`
        }
        if (content && y < window.innerHeight) {
          content.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.72)))
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Floating gold particles
  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return
    const container = particlesRef.current
    if (!container) return
    const count = 24
    const particles: HTMLDivElement[] = []
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      el.className = 'absolute rounded-full bg-gold/70 will-change-transform'
      const size = 1.5 + Math.random() * 2.5
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.left = `${Math.random() * 100}%`
      el.style.top = `${Math.random() * 100}%`
      el.style.opacity = `${0.25 + Math.random() * 0.5}`
      container.appendChild(el)
      particles.push(el)
    }
    let raf = 0
    const t0 = performance.now()
    const animate = () => {
      const t = performance.now() - t0
      particles.forEach((el, i) => {
        const phase = (i / count) * Math.PI * 2
        const driftX = Math.sin(t * 0.0004 + phase) * 22
        const driftY = Math.cos(t * 0.0005 + phase * 1.3) * 18
        el.style.transform = `translate3d(${driftX}px, ${driftY}px, 0)`
        el.style.opacity = `${0.2 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.001 + phase))}`
      })
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(raf)
      particles.forEach((el) => el.remove())
    }
  }, [])

  return (
    <section id="home" ref={rootRef} className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#080706]">
      {/* Cinematic background layers */}
      <div data-hero-bg className="absolute inset-[-6%] will-change-transform">
        <div
          data-depth="0.25"
          className="absolute inset-0 will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop"
            alt="Luxurious fine-dining restaurant interior with candlelight and elegant tables"
            className="size-full object-cover"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080706]/80 via-[#080706]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-transparent to-[#080706]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_66%_38%,rgba(201,164,92,0.22),transparent_85%)]" />
        <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Ambient light overlays */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          data-depth="0.18"
          className="absolute top-20 left-1/4 h-72 w-96 rounded-full bg-gold/10 blur-[120px]"
        />
        <div
          data-depth="0.12"
          className="absolute bottom-10 right-[16%] h-96 w-[50%] rounded-full bg-[#3a2a12]/10 blur-[140px]"
        />
      </div>

      {/* Floating gold particles */}
      <div ref={particlesRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true" />

      {/* Side rail indices */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-5 xl:flex">
        {['01', '02', '03', '04'].map((n, i) => (
          <div key={n} className="flex items-center gap-3">
            <span className={`text-[11px] tracking-[0.25em] ${i === 0 ? 'text-gold' : 'text-ivory/35'}`}>{n}</span>
            <span className={`h-px ${i === 0 ? 'w-9 bg-gold' : 'w-5 bg-ivory/25'}`} />
          </div>
        ))}
        <p className="mt-3 text-right text-[10px] uppercase leading-relaxed tracking-[0.28em] text-ivory/45">
          Good Food
          <br />
          Good People
          <br />
          Great Memories
        </p>
      </div>

      {/* Hero content */}
      <div
        data-hero-content
        className="container-lux relative z-10 grid w-full grid-cols-1 gap-14 pb-28 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:pb-36 lg:pt-40"
      >
        <div>
          <p
            className={`eyebrow mb-6 transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            Experience Fine Dining
          </p>

          <h1 className="font-display text-[clamp(52px,8.2vw,112px)] font-medium leading-[0.98] text-ivory">
            {HERO_ACCREDIT.headlineLines.map((line, i) => (
              <span
                key={line}
                className={`block transition-all duration-[1100ms] ease-lux ${
                  entered ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: `${280 + i * 140}ms` }}
              >
                {i === 1 ? (
                  <span className="text-gradient-gold">{line}</span>
                ) : (
                  line
                )}
                {i === 2 && (
                  <span className="ml-5 hidden h-px w-24 translate-y-[-14px] bg-gold/60 align-middle md:inline-block" />
                )}
              </span>
            ))}
          </h1>

          <p
            className={`mt-7 max-w-lg text-[16px] leading-relaxed text-ivory/70 transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '720ms' }}
          >
            {HERO_ACCREDIT.sub}
          </p>

          <div
            className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '880ms' }}
          >
            <button
              onClick={() => scrollToId('reservation')}
              className="btn-gold magnetic"
            >
              Book a Table
              <IconArrowRight width={16} height={16} />
            </button>
            <button
              onClick={() => scrollToId('menu')}
              className="group flex items-center gap-4 text-ivory"
            >
              <span className="relative flex size-12 place-items-center rounded-full border border-ivory/30 transition-all duration-500 ease-lux group-hover:border-gold group-hover:bg-gold/10">
                <span className="absolute inset-0 rounded-full border border-gold/40 opacity-0 transition-opacity duration-700 group-hover:animate-ping-soft group-hover:opacity-100" />
                <IconArrowRight width={16} height={16} className="ml-0.5 text-ivory transition-colors group-hover:text-gold" />
              </span>
              <span className="text-sm tracking-wide text-ivory/80 transition-colors group-hover:text-ivory">
                Explore Menu
              </span>
            </button>
          </div>

          {/* Bottom stats */}
          <div
            className={`mt-16 flex max-w-lg items-stretch justify-between gap-6 border-t border-ivory/10 pt-8 transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '1040ms' }}
          >
            {[
              { value: '5+', label: 'Expert Chefs' },
              { value: '100%', label: 'Fresh Ingredients' },
              { value: '10K+', label: 'Happy Guests' },
            ].map((s, i) => (
              <div key={s.label} className={i > 0 ? 'border-l border-ivory/10 pl-6' : ''}>
                <div className="font-display text-[30px] font-medium leading-none text-ivory sm:text-[34px]">
                  {s.value}
                </div>
                <div className="mt-2 text-[12px] tracking-wide text-ivory/55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: quote + floating accents */}
        <div className="relative hidden flex-col justify-end lg:flex">
          <figure
            className={`absolute right-2 top-2 max-w-[240px] border-l border-gold/40 pl-5 transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <blockquote className="font-display text-[22px] italic leading-snug text-ivory/90">
              “Good food brings people together.”
            </blockquote>
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.28em] text-gold/80">SAVORÉ</figcaption>
          </figure>

          {/* Floating handwritten accents */}
          <div
            className={`absolute left-0 top-24 max-w-[220px] transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '560ms' }}
          >
            {HERO_ACCREDIT.script.map((line, i) => (
              <p
                key={line}
                className={`font-script text-[clamp(28px,3.6vw,46px)] leading-tight text-gold/90 transition-all duration-700 ease-lux ${
                  entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${560 + i * 120}ms` }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Floating brand accent card */}
          <div
            className={`absolute right-20 top-32 rounded-2xl border border-gold/20 bg-[#161512]/70 p-5 backdrop-blur transition-all duration-1000 ease-lux ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '640ms' }}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Our Promise</p>
            <p className="mt-3 font-display text-lg text-ivory">Simple Ingredients.</p>
            <p className="mt-1 font-display text-lg text-ivory">Extraordinary Flavours.</p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-lux flex items-end justify-between pb-7">
          <button
            onClick={() => scrollToId('about')}
            className={`group flex items-center gap-4 transition-all duration-1000 ease-lux ${
              entered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '1200ms' }}
            aria-label="Scroll to our story"
          >
            <span className="relative flex size-10 place-items-center rounded-full border border-ivory/25">
              <span className="animate-scroll-dot absolute size-1 rounded-full bg-gold" />
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" className="text-ivory/50">
                <path d="M6 1v11M2 8.5 6 12.5 10 8.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-ivory/55 transition-colors group-hover:text-gold">
              Discover Our Story
            </span>
          </button>
          <p className="hidden text-[11px] tracking-[0.24em] text-ivory/40 sm:block">{BRAND.tagline}</p>
        </div>
      </div>
    </section>
  )
}
