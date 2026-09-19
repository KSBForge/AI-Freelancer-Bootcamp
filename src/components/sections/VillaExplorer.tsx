import { Suspense, lazy, useState } from 'react'
import { useReveal, isTouch, prefersReducedMotion } from '../../lib/hooks'
import SectionHeader from '../ui/SectionHeader'
import { IconCube } from '../ui/icons'

const VillaCanvas = lazy(() => import('../three/VillaCanvas'))

const HOTSPOTS = [
  { id: 'pool', label: 'Infinity Pool', desc: 'A 24m heated infinity edge with sunset deck.' },
  { id: 'living', label: 'Living Room', desc: 'Double-height glass lounge with skyline views.' },
  { id: 'bedroom', label: 'Bedrooms', desc: 'Four suite bedrooms, each with a private deck.' },
  { id: 'garden', label: 'Garden', desc: 'Landscaped courtyards with native planting.' },
  { id: 'rooftop', label: 'Rooftop', desc: 'Sky lounge and outdoor cinema under the stars.' },
]

export default function VillaExplorer() {
  const [active, setActive] = useState<string | null>(null)
  const [focus, setFocus] = useState<{ pos: [number, number, number]; target: [number, number, number] } | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const { ref, cls } = useReveal()

  const light = isTouch() || prefersReducedMotion()

  const goto = (id: string) => {
    setActive(id)
    setFocus(mapFocus(id))
  }
  const reset = () => {
    setActive(null)
    setFocus(null)
    setResetKey((k) => k + 1)
  }

  return (
    <section id="explorer" className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      {/* ambience */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 gold-hairline" />
        <div className="absolute -left-40 top-1/3 size-[480px] rounded-full bg-gold/[0.05] blur-[120px]" />
        <div className="absolute -right-40 bottom-0 size-[420px] rounded-full bg-[#2A4A5E]/20 blur-[110px]" />
      </div>

      <div className="container-lux relative">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="3D Property Explorer"
            title={
              <>
                Experience The
                <br />
                Property <span className="text-gradient-gold">In 3D</span>
              </>
            }
            sub="Explore in 3D — drag to orbit, scroll to zoom and tour every angle of the architecture, lit by a real sunset environment."
          />
          <div ref={ref} className={`${cls} hidden shrink-0 items-center gap-3 lg:flex`}>
            <span className="chip border-gold/40 text-gold">
              <IconCube width={13} height={13} className="mr-2" />
              WebGL · Real-time
            </span>
            <span className="chip border-white/15 text-ivory/60">Drag · Zoom · Hotspots</span>
          </div>
        </div>

        <div ref={ref} className={`${cls} mt-12 grid gap-6 lg:grid-cols-[300px_1fr]`}>
          {/* Hotspot rail */}
          <aside className="glass rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-widest2 text-gold">Architectural Tour</p>
            <div className="mt-5 space-y-2.5">
              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => goto(h.id)}
                  className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-500 ease-lux ${
                    active === h.id
                      ? 'border-gold/50 bg-gold/10'
                      : 'border-white/8 bg-white/[0.03] hover:border-gold/30 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>
                    <span className={`block text-sm font-medium ${active === h.id ? 'text-gold-light' : 'text-ivory'}`}>
                      {h.label}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-ivory/50">{h.desc}</span>
                  </span>
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      active === h.id ? 'border-gold bg-gold text-ink' : 'border-white/20 text-ivory/40 group-hover:border-gold/50 group-hover:text-gold'
                    }`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={reset}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[12px] font-medium uppercase tracking-widest transition-all duration-500 ${
                active
                  ? 'border-gold/50 bg-gold/10 text-gold hover:bg-gold/20'
                  : 'border-white/10 bg-white/[0.03] text-ivory/50 hover:border-gold/30 hover:text-gold'
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset View
            </button>

            <p className="mt-5 border-t border-white/8 pt-4 text-[11px] leading-relaxed text-ivory/40">
              {light
                ? 'Simplified 3D mode active for this device — optimized performance.'
                : 'Full 3D mode: drag to orbit, pinch or scroll to zoom. Real HDRI sunset lighting.'}
            </p>
          </aside>

          {/* 3D stage */}
          <div
            data-cursor="explore"
            className="relative min-h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B0E15] to-[#05070B] sm:min-h-[560px]"
          >
            <Suspense
              fallback={
                <div className="grid h-full min-h-[440px] place-items-center sm:min-h-[560px]">
                  <div className="flex flex-col items-center gap-4">
                    <span className="size-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
                    <p className="text-xs uppercase tracking-widest2 text-ivory/40">Preparing the villa…</p>
                  </div>
                </div>
              }
            >
              <VillaCanvas focus={focus} reduced={light} onClearFocus={() => setActive(null)} resetKey={resetKey} />
            </Suspense>

            {/* Floating 3D markers overlay */}
            <div className="pointer-events-none absolute inset-0">
              {active && (
                <div className="absolute left-1/2 top-6 -translate-x-1/2">
                  <div className="glass-gold flex items-center gap-2.5 rounded-full px-4 py-2">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-gold" />
                      <span className="relative inline-flex size-2 rounded-full bg-gold" />
                    </span>
                    <span className="text-xs font-medium tracking-wide text-ivory">
                      {HOTSPOTS.find((h) => h.id === active)?.label}
                    </span>
                  </div>
                </div>
              )}
              {/* HUD corners */}
              <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-gold/40" />
              <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-gold/40" />
              <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-gold/40" />
              <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-gold/40" />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest2 text-ivory/35">
                Nexora Virtual Tour · Aurora Sky Villa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function mapFocus(id: string): { pos: [number, number, number]; target: [number, number, number] } {
  switch (id) {
    case 'pool': return { pos: [10, 5.5, 12], target: [0, 0.5, 4] }
    case 'living': return { pos: [7, 3.4, 8.5], target: [0, 1.6, 0] }
    case 'bedroom': return { pos: [-8, 5, 8], target: [-4, 2.2, 0] }
    case 'garden': return { pos: [0, 9, 13], target: [0, 0, 0] }
    case 'rooftop': return { pos: [6, 10.5, 9], target: [0, 3.4, 0] }
    default: return { pos: [11, 6, 12], target: [0, 1.5, 0] }
  }
}
