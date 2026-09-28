import { useMemo, useState } from 'react'
import { PROPERTIES, CITIES, PRICE_RANGES, PROPERTY_CATEGORIES } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import SectionHeader from '../ui/SectionHeader'
import { IconSparkle, IconArrowRight, IconPin, IconBed, IconBath, IconArea, IconChevronDown } from '../ui/icons'

const GOALS = ['Buy', 'Invest', 'Rent']
const BEDS = ['Any', '2+', '3+', '4+', '5+']
const LIFESTYLES = ['Family Living', 'Work From Home', 'Entertainer', 'Peaceful Retreat', 'Investment']

interface Answers {
  goal: string
  city: string
  budget: string
  type: string
  beds: string
  lifestyle: string
}

const EMPTY: Answers = { goal: '', city: '', budget: '', type: '', beds: 'Any', lifestyle: '' }

function parsePrice(r: string): [number, number] {
  switch (r) {
    case 'Under ₹3 Cr': return [0, 3]
    case '₹3 - 7 Cr': return [3, 7]
    case '₹7 - 12 Cr': return [7, 12]
    case '₹12 Cr+': return [12, Infinity]
    default: return [0, Infinity]
  }
}

function scoreProperty(p: (typeof PROPERTIES)[number], a: Answers): number {
  let s = 0
  const [min, max] = parsePrice(a.budget)
  if (p.priceValue >= min && p.priceValue <= max) s += 3
  if (a.city === 'All Locations' || p.city === a.city) s += 2
  if (!a.type || a.type === 'All' || p.type === a.type) s += 2
  const needBeds = a.beds === 'Any' ? 0 : parseInt(a.beds)
  if (!needBeds || p.beds >= needBeds) s += 2
  if (a.goal === 'Invest' && p.type === 'Commercial') s += 2
  if (a.goal === 'Buy' && (p.type === 'Villas' || p.type === 'Apartments')) s += 1
  if (a.lifestyle === 'Family Living' && p.beds >= 3) s += 1
  if (a.lifestyle === 'Entertainer' && p.type === 'Villas') s += 1
  if (a.lifestyle === 'Investment' && p.badge === 'Featured') s += 1
  return s
}

export default function PropertyMatcher({ onOpenProperty }: { onOpenProperty: (id: string) => void }) {
  const [a, setA] = useState<Answers>(EMPTY)
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "I'm Nexi, your property concierge. Tell me what you're looking for — for example, “I need a 3-bedroom apartment in Mumbai under ₹4 Cr.”" },
  ])
  const { ref, cls } = useReveal()
  const { ref: chatRef, cls: chatCls } = useReveal(0.1)

  const matches = useMemo(() => {
    if (!a.goal) return []
    return [...PROPERTIES].map((p) => ({ p, s: scoreProperty(p, a) })).sort((x, y) => y.s - x.s).slice(0, 3)
  }, [a])

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((prev) => ({ ...prev, [k]: v }))

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    const userMsg = { role: 'user' as const, text: t }
    setChat((c) => [...c, userMsg])
    setMsg('')

    // naive demo NLP
    const lower = t.toLowerCase()
    const next: Answers = { ...a, goal: a.goal || 'Buy' }
    const bedMatch = lower.match(/(\d)[\s-]?(bed|bhk)/)
    if (bedMatch) next.beds = `${bedMatch[1]}+`
    const city = CITIES.find((c) => c !== 'All Locations' && lower.includes(c.toLowerCase()))
    if (city) next.city = city
    const type = PROPERTY_CATEGORIES.find((c) => c !== 'All' && lower.includes(c.toLowerCase().replace(/s$/, '')))
    if (type) next.type = type
    const crMatch = lower.match(/(\d+(?:\.\d+)?)\s*cr/)
    if (crMatch) {
      const v = parseFloat(crMatch[1])
      next.budget = v <= 3 ? 'Under ₹3 Cr' : v <= 7 ? '₹3 - 7 Cr' : v <= 12 ? '₹7 - 12 Cr' : '₹12 Cr+'
    }
    if (/invest/.test(lower)) next.goal = 'Invest'
    if (/rent/.test(lower)) next.goal = 'Rent'

    setTimeout(() => {
      setA(next)
      const scored = [...PROPERTIES].map((p) => ({ p, s: scoreProperty(p, next) })).sort((x, y) => y.s - x.s).slice(0, 2)
      const names = scored.map((m) => `${m.p.name} (${m.p.price})`).join(' and ')
      setChat((c) => [
        ...c,
        {
          role: 'ai',
          text: `Based on your preferences, I recommend ${names}. Both are verified listings with virtual tours available — shall we schedule a visit?`,
        },
      ])
    }, 650)
  }

  const done = Boolean(a.goal)

  return (
    <section id="matcher" className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-gold/[0.06] blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 size-[380px] rounded-full bg-[#2A4A5E]/15 blur-[110px]" />

      <div className="container-lux relative">
        <SectionHeader
          align="center"
          eyebrow="AI Property Matching"
          title={
            <>
              Find a Property
              <br />
              That <span className="text-gradient-gold">Fits Your Life</span>
            </>
          }
          sub="Answer a few questions and our matching engine will pair you with residences suited to your goals."
        />

        <div ref={ref} className={`${cls} mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]`}>
          {/* Matcher card */}
          <div className="glass rounded-2xl p-6 sm:p-9">
            {!done ? (
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-ivory/70">
                    <span className="mr-2 text-gold">01.</span>What are you looking for?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {GOALS.map((g) => (
                      <button
                        key={g}
                        onClick={() => set('goal', g)}
                        className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-ivory/80 transition-all duration-500 ease-lux hover:border-gold/50 hover:text-gold-light"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-ivory/35">
                  This is a demo experience — connect real AI credentials to unlock live intelligence.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip label={a.goal} onClear={() => set('goal', '')} />
                  {a.city && <Chip label={a.city} onClear={() => set('city', '')} />}
                  {a.budget && <Chip label={a.budget} onClear={() => set('budget', '')} />}
                  {a.type && <Chip label={a.type} onClear={() => set('type', '')} />}
                  {a.beds !== 'Any' && <Chip label={`${a.beds} Beds`} onClear={() => set('beds', 'Any')} />}
                  {a.lifestyle && <Chip label={a.lifestyle} onClear={() => set('lifestyle', '')} />}
                  <button onClick={() => setA(EMPTY)} className="ml-auto text-xs text-gold underline-offset-4 hover:underline">
                    Start over
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Preferred Location" value={a.city} options={['', ...CITIES.filter((c) => c !== 'All Locations')]} onChange={(v) => set('city', v)} placeholder="Select location" />
                  <Select label="Budget" value={a.budget} options={['', ...PRICE_RANGES]} onChange={(v) => set('budget', v)} placeholder="Select budget" />
                  <Select label="Property Type" value={a.type} options={['', ...PROPERTY_CATEGORIES.filter((c) => c !== 'All')]} onChange={(v) => set('type', v)} placeholder="Select type" />
                  <Select label="Bedrooms" value={a.beds} options={BEDS} onChange={(v) => set('beds', v)} placeholder="Any" />
                </div>

                <div>
                  <p className="text-sm text-ivory/70">Lifestyle</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {LIFESTYLES.map((l) => (
                      <button
                        key={l}
                        onClick={() => set('lifestyle', a.lifestyle === l ? '' : l)}
                        className={`rounded-full border px-4 py-2 text-[12.5px] transition-all duration-300 ${
                          a.lifestyle === l ? 'border-gold bg-gold/15 text-gold-light' : 'border-white/15 text-ivory/70 hover:border-gold/40'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {matches.length > 0 && (
              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-gold">
                  <IconSparkle width={14} height={14} /> Your Property Match
                </p>
                <div className="mt-5 space-y-3">
                  {matches.map(({ p, s }, i) => (
                    <button
                      key={p.id}
                      onClick={() => onOpenProperty(p.id)}
                      className="group flex w-full items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-left transition-all duration-500 ease-lux hover:border-gold/40 hover:bg-white/[0.06]"
                      style={{ animation: `fadeUp .6s ${i * 0.12}s both` }}
                    >
                      <img src={p.image} alt={p.name} loading="lazy" className="size-16 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-lg text-ivory">{p.name}</p>
                        <p className="flex items-center gap-1.5 text-[12px] text-ivory/55">
                          <IconPin width={11} height={11} /> {p.location} · {p.beds || '—'} Beds · {p.area}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-base text-gradient-gold">{p.price}</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/40">{Math.round(s * 12)}% match</p>
                      </div>
                      <IconArrowRight width={16} height={16} className="text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat assistant */}
          <div ref={chatRef} className={`${chatCls} flex min-h-[420px] flex-col rounded-2xl border border-gold/25 bg-[#12151f]/80 backdrop-blur-xl`}>
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
              <span className="relative grid size-9 place-items-center rounded-full bg-gold/15 text-gold">
                <IconSparkle width={17} height={17} />
              </span>
              <div>
                <p className="text-sm font-medium text-ivory">Nexi Assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-ivory/45">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Demo mode
                </p>
              </div>
            </div>

            <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-gold text-ink'
                        : 'rounded-bl-md bg-white/[0.07] text-ivory/85'
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                {['3-bed apartment in Mumbai under ₹4 Cr', 'Family villa in Bangalore', 'Commercial for investment'].map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-white/12 px-3 py-1.5 text-[11.5px] text-ivory/55 transition hover:border-gold/40 hover:text-gold-light"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(msg)
              }}
              className="border-t border-white/8 p-4"
            >
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-4 pr-1.5 transition focus-within:border-gold/50">
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell me what you're looking for…"
                  className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/35"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-ink transition-transform duration-300 hover:scale-105"
                >
                  <IconArrowRight width={15} height={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs text-gold-light">
      {label}
      <button onClick={onClear} aria-label={`Remove ${label}`} className="text-gold/70 hover:text-gold">
        <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-ivory/50">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold/60"
        >
          {options.map((o) => (
            <option key={o || 'none'} value={o} className="bg-midnight">
              {o || placeholder}
            </option>
          ))}
        </select>
        <IconChevronDown width={15} height={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/40" />
      </span>
    </label>
  )
}
