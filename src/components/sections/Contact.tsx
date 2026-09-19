import { BRAND } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { scrollToId } from '../../lib/smooth'
import { IconPhone, IconMail, IconPin, IconArrowRight, IconInstagram, IconFacebook, IconLinkedin, IconYoutube } from '../ui/icons'

const SOCIAL_ICONS: Record<string, (p: { width?: number; height?: number }) => JSX.Element> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  linkedin: IconLinkedin,
  youtube: IconYoutube,
}

export default function Contact({ onSchedule }: { onSchedule: () => void }) {
  const { ref, cls } = useReveal()

  return (
    <section id="contact" className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      <div data-parallax className="absolute inset-[-10%] opacity-30">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/60" />

      <div ref={ref} className={`${cls} container-lux relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]`}>
        <div>
          <span className="eyebrow">Get In Touch</span>
          <h2 className="mt-5 font-display text-[clamp(34px,4.6vw,56px)] font-medium leading-[1.05] text-ivory">
            Let's Find Your
            <br />
            Perfect <span className="text-gradient-gold">Property</span>
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ivory/60">
            Whether you're looking to buy, invest, or just explore, our experts are here to help you take the next
            step.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button onClick={onSchedule} className="btn-gold">
              Schedule a Call
              <IconArrowRight width={16} height={16} />
            </button>
            <button onClick={() => scrollToId('lead-form')} className="btn-ghost">
              Contact Us
            </button>
          </div>
        </div>

        <div className="space-y-7">
          <ContactRow icon={<IconPhone width={19} height={19} />} title={BRAND.phone} sub={BRAND.hours} href={BRAND.phoneHref} />
          <ContactRow icon={<IconMail width={19} height={19} />} title={BRAND.email} sub="We reply within 24 hours" href={`mailto:${BRAND.email}`} />
          <ContactRow icon={<IconPin width={19} height={19} />} title={BRAND.address.split(',')[0] + ','} sub={BRAND.address.split(',').slice(1).join(',').trim()} />

          <div>
            <p className="text-[12px] uppercase tracking-widest2 text-ivory/45">Follow Us</p>
            <div className="mt-4 flex gap-3">
              {BRAND.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon]
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-white/15 text-ivory/70 transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-gold hover:text-gold"
                  >
                    <Icon width={17} height={17} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="border-l border-gold/40 pl-5 font-script text-[24px] italic leading-snug text-ivory/85">
            “A Brighter Tomorrow Starts with Home.”
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ icon, title, sub, href }: { icon: React.ReactNode; title: string; sub: string; href?: string }) {
  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/[0.07] text-gold">
        {icon}
      </span>
      <span>
        <span className="block font-display text-[19px] text-ivory">{title}</span>
        <span className="mt-0.5 block text-[12.5px] text-ivory/50">{sub}</span>
      </span>
    </>
  )
  return href ? (
    <a href={href} className="group flex items-center gap-4">
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-4">{content}</div>
  )
}
