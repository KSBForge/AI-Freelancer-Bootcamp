import { BRAND, NAV_LINKS } from '../../data/site'
import { useState } from 'react'
import Logo from '../ui/Logo'
import { scrollToId } from '../../lib/smooth'
import { IconInstagram, IconFacebook, IconYoutube, IconPin, IconMail, IconClock } from '../ui/icons'

const SOCIAL_ICONS: Record<string, (p: { width?: number; height?: number }) => JSX.Element> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  youtube: IconYoutube,
  pin: IconPin,
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setDone(true)
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#050403] pb-12 pt-16">
      <div className="container-lux">
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.06] pb-10 mb-10 sm:grid-cols-2 lg:grid-cols-5 lg:border-b-0 lg:pb-0 lg:pt-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs font-script text-[22px] leading-snug text-gold/85">
              Food Brings People Together
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid gap-4 lg:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">Quick Links</p>
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollToId(l.href.slice(1))}
                className="text-left text-sm text-ivory/60 transition-colors hover:text-ivory"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Opening Hours */}
          <div className="grid gap-4 lg:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">Opening Hours</p>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="grid size-9 place-items-center rounded-full bg-gold/10 text-gold">
                <IconClock width={16} height={16} />
              </span>
              <div>
                <p className="text-sm text-ivory/90">Mon - Sun</p>
                <p className="text-[12.5px] text-ivory/55">11:00 AM - 11:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="grid size-9 place-items-center rounded-full bg-gold/10 text-gold">
                <IconPin width={16} height={16} />
              </span>
              <div>
                <p className="text-sm text-ivory/90">123 Food Street</p>
                <p className="text-[12.5px] text-ivory/55">Jaipur, India</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid gap-4 lg:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">Contact Us</p>
            <a href={BRAND.phoneHref} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-gold/30">
              <span className="grid size-9 place-items-center rounded-full bg-gold/10 text-gold">
                <IconMail width={16} height={16} />
              </span>
              <div>
                <p className="text-sm text-ivory/90">{BRAND.email}</p>
                <p className="text-[12.5px] text-ivory/55">Anytime, via email</p>
              </div>
            </a>
            <a href={BRAND.phoneHref} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-gold/30">
              <span className="grid size-9 place-items-center rounded-full bg-gold/10 text-gold">
                <IconClock width={16} height={16} />
              </span>
              <div>
                <p className="text-sm text-ivory/90">{BRAND.phone}</p>
                <p className="text-[12.5px] text-ivory/55">Call or WhatsApp</p>
              </div>
            </a>
          </div>

          {/* Follow Us */}
          <div className="grid gap-4 lg:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">Follow Us</p>
            <div className="flex gap-3">
              {BRAND.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon]
                return (
                  <a
                    key={s.label}
                    href={s.href.startsWith('http') ? s.href : BRAND.phoneHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-full border border-white/10 text-ivory/60 transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-gold hover:text-gold"
                  >
                    <Icon width={15} height={15} />
                  </a>
                )
              })}
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/40">#SAVORÉMoments</p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 sm:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:justify-between lg:items-start">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">Stay Connected</p>
              <h3 className="mt-2 font-display text-2xl text-ivory">
                Get the latest updates,
                <br />
                special offers & events
              </h3>
            </div>
            {done ? (
              <p className="rounded-xl bg-gold/10 border border-gold/20 px-5 py-3 text-sm text-ivory">
                Thank you — you’re on the list.
              </p>
            ) : (
              <form onSubmit={subscribe} className="flex w-full max-w-sm gap-3" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition focus:border-gold/60"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg border border-gold/40 bg-gold text-ink px-5 py-3 text-sm font-medium transition hover:bg-gold-light"
                >
                  →
                </button>
              </form>
            )}
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-ivory/35">
            GOOD FOOD · GOOD PEOPLE · GREAT MEMORIES
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 pb-10 text-center text-[12px] text-ivory/40 sm:flex-row">
          <p>© 2026 SAVORÉ Restaurant. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms & Conditions', 'Sitemap'].map((t) => (
              <button key={t} className="transition-colors hover:text-ivory/75">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom brand accent */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <p className="relative -translate-y-1/2 font-script text-[22px] text-gold/70 lg:absolute lg:right-10 lg:top-1/2">
          Good Food Brings People Together
        </p>
      </div>
    </footer>
  )
}
