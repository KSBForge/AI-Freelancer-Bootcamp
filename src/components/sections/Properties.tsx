import { useMemo, useState } from 'react'
import { PROPERTIES, PROPERTY_CATEGORIES, CITIES, PRICE_RANGES, type Property } from '../../data/site'
import { useReveal, useTilt } from '../../lib/hooks'
import { scrollToId } from '../../lib/smooth'
import SectionHeader from '../ui/SectionHeader'
import { IconPin, IconBed, IconBath, IconArea, IconArrowRight, IconArrowUpRight, IconHeart, IconSearch, IconHome, IconChevronDown, IconStar } from '../ui/icons'

interface Filters {
  city: string
  price: string
}

function parsePrice(r: string): [number, number] {
  switch (r) {
    case 'Under ₹3 Cr': return [0, 3]
    case '₹3 - 7 Cr': return [3, 7]
    case '₹7 - 12 Cr': return [7, 12]
    case '₹12 Cr+': return [12, Infinity]
    default: return [0, Infinity]
  }
}

export default function Properties({
  favorites,
  onToggleFav,
  onOpenProperty,
  onSchedule,
}: {
  favorites: Set<string>
  onToggleFav: (id: string) => void
  onOpenProperty: (id: string) => void
  onSchedule: () => void
}) {
  const [cat, setCat] = useState('All')
  const [filters, setFilters] = useState<Filters>({ city: 'All Locations', price: 'Any Budget' })
  const { ref: bandRef, cls: bandCls } = useReveal()
  const { ref: quoteRef, cls: quoteCls } = useReveal(0.3)

  const list = useMemo(() => {
    const [min, max] = parsePrice(filters.price)
    return PROPERTIES.filter(
      (p) =>
        (cat === 'All' || p.type === cat) &&
        (filters.city === 'All Locations' || p.city === filters.city) &&
        p.priceValue >= min &&
        p.priceValue <= max,
    )
  }, [cat, filters])

  return (
    <section id="properties" className="relative bg-ivory">
      {/* Cinematic dark header band with full-bleed imagery */}
      <div className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 lg:left-[46%]">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop"
            alt="Luxury lounge with coastal view at dusk"
            loading="lazy"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/55 lg:bg-transparent" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-charcoal via-charcoal/55 to-transparent lg:block" />
        </div>

        <div className="container-lux relative grid items-center gap-8 py-16 sm:py-20 lg:min-h-[460px] lg:grid-cols-[1fr_0.9fr] lg:py-24">
          <div ref={bandRef} className={bandCls}>
            <SectionHeader
              eyebrow="Our Properties"
              title={
                <>
                  Exclusive Properties
                  <br />
                  For Every <span className="text-gradient-gold">Dream</span>
                </>
              }
              sub="From modern city apartments to serene beachfront villas, explore handpicked properties that match your lifestyle."
            />
          </div>
          <figure ref={quoteRef} className={`${quoteCls} hidden justify-self-end lg:block`}>
            <blockquote className="max-w-[220px] border-l-2 border-gold/60 pl-5 font-display text-[21px] italic leading-snug text-ivory/90">
              “Spaces that inspire a better you.”
            </blockquote>
            <figcaption className="mt-3 pl-5 text-[11px] uppercase tracking-widest2 text-gold/80">Nexora</figcaption>
          </figure>
        </div>
      </div>

      <div className="container-lux">

        {/* Category tabs + filters */}
        <div className="mt-12 flex flex-col gap-5 border-b border-ink/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            {PROPERTY_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`relative whitespace-nowrap px-4 py-2.5 text-[13.5px] tracking-wide transition-colors duration-300 ${
                  cat === c ? 'text-ink' : 'text-ink/50 hover:text-ink'
                }`}
              >
                {c}
                <span
                  className={`absolute inset-x-3 bottom-0 h-[2px] bg-gold transition-transform duration-500 ease-lux ${
                    cat === c ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              label="Select Location"
              icon="pin"
              value={filters.city}
              options={CITIES}
              onChange={(v) => setFilters((f) => ({ ...f, city: v }))}
            />
            <FilterSelect
              label="Price Range"
              icon="area"
              value={filters.price}
              options={PRICE_RANGES}
              onChange={(v) => setFilters((f) => ({ ...f, price: v }))}
            />
            <div className="relative flex-1 sm:flex-none">
              <select
                aria-label="Property type"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="peer w-full appearance-none rounded-lg border border-ink/15 bg-white py-3.5 pl-11 pr-10 text-sm text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
              >
                {PROPERTY_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40">
                <IconHome width={16} height={16} className="opacity-70" />
              </span>
              <IconChevronDown width={16} height={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            </div>
            <button
              onClick={() => scrollToId('properties-grid')}
              className="btn-dark shrink-0 !py-3.5"
              aria-label="Search properties"
            >
              <IconSearch width={15} height={15} />
              Search Properties
            </button>
          </div>
        </div>

        {/* Grid */}
        <div id="properties-grid" className="mt-12 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((p, i) => (
            <PropertyCard
              key={p.id}
              p={p}
              index={i}
              fav={favorites.has(p.id)}
              onToggleFav={onToggleFav}
              onOpen={() => onOpenProperty(p.id)}
            />
          ))}
        </div>

        {list.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-ink/20 bg-white/60 p-14 text-center">
            <p className="font-display text-2xl text-ink">No properties match your search</p>
            <p className="mt-2 text-sm text-ink/55">Try a different category, location or budget.</p>
            <button
              onClick={() => {
                setCat('All')
                setFilters({ city: 'All Locations', price: 'Any Budget' })
              }}
              className="btn-gold mt-6"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  icon: string
}) {
  return (
    <div className="relative flex-1 sm:flex-none">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-ink/15 bg-white py-3.5 pl-11 pr-10 text-sm text-ink outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40">
        {icon === 'pin' ? <IconPin width={16} height={16} /> : <IconArea width={16} height={16} />}
      </span>
      <IconChevronDown width={16} height={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
    </div>
  )
}

const BADGE_STYLES: Record<string, string> = {
  Featured: 'bg-gold text-ink',
  New: 'bg-midnight text-ivory',
  Popular: 'bg-[#8C3B2E] text-ivory',
  Luxury: 'bg-gradient-to-r from-gold-deep to-gold text-ink',
}

function PropertyCard({
  p,
  index,
  fav,
  onToggleFav,
  onOpen,
}: {
  p: Property
  index: number
  fav: boolean
  onToggleFav: (id: string) => void
  onOpen: () => void
}) {
  const tiltRef = useTilt<HTMLDivElement>(5)
  const { ref, cls } = useReveal(0.08)

  return (
    <div ref={ref} className={`${cls} perspective-1200`} style={{ transitionDelay: `${(index % 4) * 90}ms` }}>
      <article
        ref={tiltRef}
        data-cursor="view"
        onClick={onOpen}
        className="group card-ivory cursor-pointer overflow-hidden transition-[transform,box-shadow] duration-500 ease-lux will-change-transform hover:shadow-lux-sm"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1200ms] ease-lux group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-ink/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {p.badge && (
            <span
              className={`chip absolute left-3.5 top-3.5 border-transparent font-medium ${BADGE_STYLES[p.badge]}`}
            >
              {p.badge === 'Featured' && <IconStar width={11} height={11} className="mr-1.5" />}
              {p.badge}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFav(p.id)
            }}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={fav}
            className={`absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-full backdrop-blur transition-all duration-300 ${
              fav ? 'bg-gold text-ink' : 'bg-white/80 text-ink/60 hover:text-[#B3543E]'
            }`}
          >
            <IconHeart width={16} height={16} fill={fav ? 'currentColor' : 'none'} />
          </button>

          <span className="absolute bottom-3.5 right-3.5 grid size-10 translate-y-2 place-items-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 ease-lux group-hover:translate-y-0 group-hover:opacity-100">
            <IconArrowUpRight width={15} height={15} />
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-[22px] leading-tight text-ink">{p.name}</h3>
            <span className="whitespace-nowrap font-display text-lg text-ink">{p.price}</span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink/55">
            <IconPin width={13} height={13} className="text-gold-deep" />
            {p.location}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
            <div className="flex items-center gap-4 text-[12px] text-ink/60">
              <span className="flex items-center gap-1.5">
                <IconBed width={15} height={15} className="text-ink/45" />
                {p.beds || '—'} Beds
              </span>
              <span className="size-1 rounded-full bg-ink/15" />
              <span className="flex items-center gap-1.5">
                <IconBath width={15} height={15} className="text-ink/45" />
                {p.baths || '—'} Baths
              </span>
              <span className="size-1 rounded-full bg-ink/15" />
              <span className="flex items-center gap-1.5">
                <IconArea width={15} height={15} className="text-ink/45" />
                {p.area}
              </span>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sand text-gold-deep transition-all duration-500 ease-lux group-hover:bg-gold group-hover:text-ink">
              <IconArrowRight width={15} height={15} />
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}
