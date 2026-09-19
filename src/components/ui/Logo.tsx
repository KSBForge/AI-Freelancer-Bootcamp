import { BRAND } from '../../data/site'

export default function Logo({ light = true, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label={`${BRAND.name} home`}>
      <span className="relative grid size-11 place-items-center">
        <svg viewBox="0 0 44 44" className="size-11 text-gold transition-transform duration-700 ease-lux group-hover:-rotate-[6deg]">
          <path
            d="M22 6c-6 2-11 6-11 11a11 11 0 0 0 22 0c0-5-5-9-11-11z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M22 14c-3 5-4 9-4 12a4 4 0 0 0 8 0c0-3-1-7-4-12z"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M22 20v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M22 24v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-gold/20 opacity-0 blur-lg transition-opacity duration-700 group-hover:opacity-100" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block font-display text-[26px] font-medium tracking-[0.22em] ${light ? 'text-ivory' : 'text-ink'}`}
          >
            SAVORÉ
          </span>
          <span
            className={`mt-1 block text-[9px] font-medium uppercase tracking-[0.4em] ${light ? 'text-ivory/60' : 'text-ink/50'}`}
          >
            {BRAND.sub}
          </span>
        </span>
      )}
    </a>
  )
}
