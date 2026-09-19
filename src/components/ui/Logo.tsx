import { BRAND } from '../../data/site'

export default function Logo({ light = true, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label={`${BRAND.name} home`}>
      <span className="relative grid size-11 place-items-center">
        <svg viewBox="0 0 44 44" className="size-11 text-gold transition-transform duration-700 ease-lux group-hover:rotate-[8deg]">
          <path
            d="M22 5 8 15.5V39h28V15.5L22 5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M22 13v13M16 20.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-gold/20 opacity-0 blur-lg transition-opacity duration-700 group-hover:opacity-100" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block font-display text-[26px] font-medium tracking-[0.18em] ${light ? 'text-ivory' : 'text-ink'}`}
          >
            {BRAND.name}
          </span>
          <span
            className={`mt-1 block text-[9px] font-medium uppercase tracking-widest2 ${light ? 'text-ivory/60' : 'text-ink/50'}`}
          >
            {BRAND.sub}
          </span>
        </span>
      )}
    </a>
  )
}
