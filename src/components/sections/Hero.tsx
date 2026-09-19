import { useEffect, useRef, useState } from 'react'
import { BRAND, HERO_IMAGES, HERO_STATS, PROPERTIES } from '../../data/site'
import { prefersReducedMotion, isTouch, useReveal } from '../../lib/hooks'
import { scrollToId } from '../../lib/smooth'
import { IconArrowRight, IconPlay, IconArrowUpRight } from '../ui/icons'
import PropertyModal from '../PropertyModal'

const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=60&auto=format',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&q=60&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=60&auto=format',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&q=60&auto=format',
]

interface Props {
  onWatchStory: () => void
}

export default function Hero({ onWatchStory }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const { ref: featuredRef, cls: featuredCls } = useReveal<HTMLDivElement>(0.3)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Mouse-driven 3D camera on the layered hero scene
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

  return (
    <section id="home" ref={rootRef} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      {/* Layered cinematic scene */}
      <div data-hero-bg className="absolute inset-[-6%] will-change-transform">
        <div data-depth="0.25" className="absolute inset-0 will-change-transform">
          <img
            src={HERO_IMAGES.hero}
            alt="Luxury villa with infinity pool at dusk"
            className="size-full object-cover"
            fetchPriority="high"
          />
        </div>
        {/* Cinematic grade: dusk vignette + warm bloom */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_66%_38%,rgba(255,158,84,0.16),transparent_45%)]" />
        <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Side rail indices */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-5 xl:flex">
        {['01', '02', '03', '04'].map((n, i) => (
          <div key={n} className="flex items-center gap-3">
            <span className={`text-[11px] tracking-[0.25em] ${i === 0 ? 'text-gold' : 'text-ivory/35'}`}>{n}</span>
            <span className={`h-px ${i === 0 ? 'w-9 bg-gold' : 'w-5 bg-ivory/25'}`} />
          </div>
        ))}
        <p className="mt-3 text-right text-[10px] uppercase leading-relaxed tracking-widest2 text-ivory/45">
          Good Spaces
          <br />
          Better
          <br />
          Lives
        </p>
      </div>

      <div
        data-hero-content
        className="container-lux relative z-10 grid w-full grid-cols-1 gap-14 pb-28 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:pb-36 lg:pt-40"
      >
        {/* Left: headline */}
        <div>
          <p
            className={`eyebrow mb-6 transition-all duration-1000 ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            style={{ transitionDelay: '150ms' }}
          >
            More Than Properties
          </p>

          <h1 className="font-display text-[clamp(52px,8.2vw,112px)] font-medium leading-[0.98] text-ivory">
            {['A Better', 'Tomorrow', 'Lives Here'].map((line, i) => (
              <span
                key={line}
                className={`block transition-all duration-[1100ms] ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                style={{ transitionDelay: `${280 + i * 140}ms` }}
              >
                {i === 1 ? <span className="text-gradient-gold">{line}</span> : line}
                {i === 2 && (
                  <span className="ml-5 hidden h-px w-24 translate-y-[-14px] bg-gold/60 align-middle md:inline-block" />
                )}
              </span>
            ))}
          </h1>

          <p
            className={`mt-7 max-w-md text-[16px] leading-relaxed text-ivory/70 transition-all duration-1000 ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '720ms' }}
          >
            Discover exceptional homes, prime locations, and smart investments for a brighter future.
          </p>

          <div
            className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-1000 ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '880ms' }}
          >
            <button onClick={() => scrollToId('properties')} className="btn-gold magnetic">
              Explore Properties
              <IconArrowRight width={17} height={17} />
            </button>
            <button onClick={onWatchStory} className="group flex items-center gap-4 text-ivory">
              <span className="relative grid size-14 place-items-center rounded-full border border-ivory/30 transition-all duration-500 ease-lux group-hover:border-gold group-hover:bg-gold/10">
                <IconPlay width={16} height={16} className="ml-0.5 text-ivory transition-colors group-hover:text-gold" />
                <span className="absolute inset-0 rounded-full border border-gold/40 opacity-0 transition-opacity duration-700 group-hover:animate-ping-soft group-hover:opacity-100" />
              </span>
              <span className="text-sm tracking-wide text-ivory/80 transition-colors group-hover:text-ivory">
                Watch Our Story
              </span>
            </button>
          </div>

          {/* Bottom stats */}
          <div
            className={`mt-16 flex max-w-lg items-stretch justify-between gap-6 border-t border-ivory/12 pt-8 transition-all duration-1000 ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '1040ms' }}
          >
            {HERO_STATS.map((s, i) => (
              <div key={s.label} className={i > 0 ? 'border-l border-ivory/10 pl-6' : ''}>
                <div className="font-display text-[30px] font-medium leading-none text-ivory sm:text-[34px]">
                  {s.value}
                  <span className="text-gradient-gold">{s.suffix}</span>
                </div>
                <div className="mt-2 text-[12px] tracking-wide text-ivory/55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: quote + featured card zone */}
        <div className="relative hidden flex-col justify-end lg:flex">
          <figure
            className={`absolute right-2 top-2 max-w-[240px] border-l border-gold/40 pl-5 transition-all duration-1000 ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <blockquote className="font-display text-[22px] italic leading-snug text-ivory/90">
              “Not just a house, but a place to belong.”
            </blockquote>
            <figcaption className="mt-3 text-[11px] uppercase tracking-widest2 text-gold/80">Nexora</figcaption>
          </figure>

          {/* Floating client stat */}
          <div
            className={`absolute right-40 top-24 flex items-center gap-3 transition-all duration-1000 ease-lux ${entered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex -space-x-3">
              {AVATARS.map((a) => (
                <img
                  key={a}
                  src={a}
                  alt=""
                  loading="lazy"
                  className="size-9 rounded-full border-2 border-ink object-cover"
                />
              ))}
            </div>
            <div>
              <div className="font-display text-xl text-ivory">10K+</div>
              <div className="text-[11px] text-ivory/55">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating featured property card (glass, tilts toward cursor) */}
      <div
        ref={featuredRef}
        className={`absolute bottom-24 right-8 z-20 hidden lg:block ${featuredCls}`}
        data-cursor="view"
      >
        <FeaturedCard onOpen={() => setSelected('oceanview-villa')} />
      </div>

      {/* Scroll cue + motto */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-lux flex items-end justify-between pb-7">
          <button
            onClick={() => scrollToId('properties')}
            className={`group flex items-center gap-4 transition-all duration-1000 ease-lux ${entered ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '1200ms' }}
            aria-label="Scroll to explore"
          >
            <span className="relative grid size-10 place-items-center rounded-full border border-ivory/25">
              <span className="animate-scroll-dot absolute size-1 rounded-full bg-gold" />
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" className="text-ivory/50">
                <path d="M6 1v11M2 8.5 6 12.5 10 8.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[11px] uppercase tracking-widest2 text-ivory/55 transition-colors group-hover:text-gold">
              Scroll to Explore
            </span>
          </button>
          <p className="hidden text-[11px] tracking-[0.22em] text-ivory/40 sm:block">{BRAND.motto}</p>
        </div>
      </div>

      {selected && <PropertyModal id={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function FeaturedCard({ onOpen }: { onOpen: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = cardRef.current
    if (!el || isTouch() || prefersReducedMotion()) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translateZ(0)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={cardRef} className="glass-gold w-[330px] rounded-2xl p-3.5 shadow-lux transition-transform duration-300 ease-lux will-change-transform">
      <div className="flex items-center gap-3.5">
        <img
          src={HERO_IMAGES.thumb}
          alt="Oceanview Villa"
          loading="lazy"
          className="size-[72px] rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest2 text-gold">Featured Property</p>
          <h3 className="mt-1 truncate font-display text-xl text-ivory">Oceanview Villa</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ivory/60">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Mumbai, India
          </p>
        </div>
        <button
          onClick={onOpen}
          aria-label="View Oceanview Villa"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gold text-ink transition-all duration-500 ease-lux hover:rotate-45 hover:bg-gold-light"
        >
          <IconArrowUpRight width={16} height={16} />
        </button>
      </div>
    </div>
  )
}

