import { Suspense, lazy, useState } from 'react'
import { useReveal, isTouch, prefersReducedMotion } from '../../lib/hooks'
import SectionHeader from '../ui/SectionHeader'
import type { TourRoom } from '../three/PanoramaTour'

const PanoramaTour = lazy(() => import('../three/PanoramaTour'))

const PAN = (p: string) => `${import.meta.env.BASE_URL}panos/${p}`

/** Real photographed spaces (CC0 captures from Poly Haven) rendered as 360° photo spheres. */
const ROOMS: TourRoom[] = [
  {
    id: 'living',
    name: 'Glass Living Pavilion',
    desc: 'Floor-to-ceiling glazing wrapping the lounge, dining and fireplace.',
    pano: PAN('glasshouse_interior.hdr'),
    thumb: PAN('glasshouse_interior.jpg'),
    start: { lon: 0, lat: 0 },
  },
  {
    id: 'kitchen',
    name: 'Chef’s Kitchen',
    desc: 'Bulthaup-style cabinetry with morning light over the breakfast island.',
    pano: PAN('lebombo.hdr'),
    thumb: PAN('lebombo.jpg'),
    start: { lon: 40, lat: 4 },
  },
  {
    id: 'bedroom',
    name: 'Sea-View Master Suite',
    desc: 'Wake up to the ocean — private balcony and dressing lounge.',
    pano: PAN('relax_inn_seaview_suite.hdr'),
    thumb: PAN('relax_inn_seaview_suite.jpg'),
    start: { lon: 180, lat: 2 },
  },
  {
    id: 'deck',
    name: 'Sunset Deck & Pool',
    desc: 'The infinity edge at golden hour, above the water.',
    pano: PAN('sundowner_deck.hdr'),
    thumb: PAN('sundowner_deck.jpg'),
    start: { lon: 0, lat: 0 },
  },
]

export default function VillaExplorer() {
  const [active, setActive] = useState<string>('living')
  const { ref, cls } = useReveal()

  const light = isTouch() || prefersReducedMotion()
  const room = ROOMS.find((r) => r.id === active) ?? ROOMS[0]

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
            eyebrow="360° Photo Tour"
            title={
              <>
                Experience The
                <br />
                Property <span className="text-gradient-gold">In 3D</span>
              </>
            }
            sub="Step inside real photographs of the home — drag to look around in every direction, scroll to zoom, and move from room to room."
          />
          <div ref={ref} className={`${cls} hidden shrink-0 items-center gap-3 lg:flex`}>
            <span className="chip border-gold/40 text-gold">360° Photography</span>
            <span className="chip border-white/15 text-ivory/60">Drag · Zoom · Rooms</span>
          </div>
        </div>

        <div ref={ref} className={`${cls} mt-12 grid gap-6 lg:grid-cols-[300px_1fr]`}>
          {/* Room rail */}
          <aside className="glass rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-widest2 text-gold">Tour the Home</p>
            <div className="mt-5 space-y-2.5">
              {ROOMS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActive(r.id)}
                  className={`group flex w-full items-center gap-3.5 rounded-xl border p-2.5 text-left transition-all duration-500 ease-lux ${
                    active === r.id
                      ? 'border-gold/50 bg-gold/10'
                      : 'border-white/8 bg-white/[0.03] hover:border-gold/30 hover:bg-white/[0.06]'
                  }`}
                >
                  <img
                    src={r.thumb}
                    alt=""
                    loading="lazy"
                    className={`size-14 shrink-0 rounded-lg object-cover transition-all duration-500 ${
                      active === r.id ? 'ring-1 ring-gold/60' : 'opacity-75 group-hover:opacity-100'
                    }`}
                  />
                  <span className="min-w-0">
                    <span className={`block truncate text-sm font-medium ${active === r.id ? 'text-gold-light' : 'text-ivory'}`}>
                      {r.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-ivory/50">{r.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-5 border-t border-white/8 pt-4 text-[11px] leading-relaxed text-ivory/40">
              {light
                ? 'Simplified mode active for this device — optimized performance.'
                : 'Drag to look around · scroll to zoom · real photographic panoramas.'}
            </p>
          </aside>

          {/* 360° stage */}
          <div
            data-cursor="explore"
            className="relative min-h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0B0E15] to-[#05070B] sm:min-h-[560px]"
          >
            <Suspense
              fallback={
                <div className="grid h-full min-h-[440px] place-items-center sm:min-h-[560px]">
                  <div className="flex flex-col items-center gap-4">
                    <span className="size-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
                    <p className="text-xs uppercase tracking-widest2 text-ivory/40">Loading the photo tour…</p>
                  </div>
                </div>
              }
            >
              <PanoramaTour rooms={ROOMS} activeId={active} reduced={light} />
            </Suspense>

            {/* HUD overlay */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-gold/40" />
              <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-gold/40" />
              <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-gold/40" />
              <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-gold/40" />

              <div className="absolute left-1/2 top-6 -translate-x-1/2">
                <div className="glass-gold flex items-center gap-2.5 rounded-full px-4 py-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-gold" />
                    <span className="relative inline-flex size-2 rounded-full bg-gold" />
                  </span>
                  <span className="text-xs font-medium tracking-wide text-ivory">{room.name}</span>
                </div>
              </div>

              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest2 text-ivory/35">
                Nexora 360° Tour · Aurora Sky Villa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
