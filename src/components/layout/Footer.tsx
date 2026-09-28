import { BRAND, NAV_LINKS } from '../../data/site'
import Logo from '../ui/Logo'
import { scrollToId } from '../../lib/smooth'
import { IconInstagram, IconFacebook, IconLinkedin, IconYoutube } from '../ui/icons'

const SOCIAL_ICONS: Record<string, (p: { width?: number; height?: number }) => JSX.Element> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  linkedin: IconLinkedin,
  youtube: IconYoutube,
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink pb-10 pt-16">
      <div className="container-lux">
        <div className="flex flex-col items-center gap-8 pb-10 lg:flex-row lg:justify-between">
          <Logo />
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3" aria-label="Footer">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollToId(l.href.slice(1))}
                className="link-underline text-[13px] tracking-wide text-ivory/65 transition-colors hover:text-ivory"
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div className="flex gap-3">
            {BRAND.socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-ivory/60 transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-gold hover:text-gold"
                >
                  <Icon width={16} height={16} />
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 py-5">
          <div className="h-px flex-1 bg-white/[0.07]" />
          <span className="text-[11px] uppercase tracking-widest2 text-gold/70">{BRAND.motto}</span>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-[12px] text-ivory/40 sm:flex-row">
          <p>© 2026 {BRAND.name.charAt(0) + BRAND.name.slice(1).toLowerCase()} Real Estate. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms & Conditions', 'Sitemap'].map((t) => (
              <button key={t} className="transition-colors hover:text-ivory/75">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
