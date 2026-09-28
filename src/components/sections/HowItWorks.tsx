import { STEPS } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { ICONS } from '../ui/icons'

export default function HowItWorks() {
  const { ref, cls } = useReveal(0.12)
  const { ref: headRef, cls: headCls } = useReveal()

  return (
    <section id="how-it-works" className="relative bg-ivory py-24 sm:py-32">
      <div className="container-lux">
        <div ref={headRef} className={`${headCls} grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]`}>
          <div>
            <span className="eyebrow !text-gold-deep">How It Works</span>
            <h2 className="mt-5 font-display text-[clamp(34px,4.4vw,54px)] font-medium leading-[1.06] text-ink">
              Your Dream Home
              <br />
              in Simple Steps
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink/60 lg:justify-self-end">
            We make real estate simple, transparent, and hassle-free. Follow a few easy steps and get closer to your
            dream property.
          </p>
        </div>

        <div ref={ref} className={`${cls} relative mt-16`}>
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-[44px] hidden h-px bg-ink/10 lg:block">
            <div className="h-px w-0 bg-gold transition-[width] duration-[2200ms] ease-lux data-[active=true]:w-full" data-active={cls.includes('reveal-in') ? 'true' : 'false'} />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <Step key={s.num} s={s} i={i} active={cls.includes('reveal-in')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({ s, i, active }: { s: (typeof STEPS)[number]; i: number; active: boolean }) {
  const Icon = ICONS[s.icon] ?? ICONS.search
  return (
    <div
      className="group relative"
      style={{
        transition: 'opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)',
        transitionDelay: `${i * 260}ms`,
        opacity: active ? 1 : 0,
        transform: active ? 'none' : 'translateY(30px)',
      }}
    >
      <div className="flex items-center gap-5 lg:flex-col lg:items-start">
        <span className="relative z-10 grid size-[72px] shrink-0 place-items-center rounded-full bg-sand text-gold-deep transition-all duration-700 ease-lux group-hover:scale-105 group-hover:bg-gold group-hover:text-ink lg:size-[88px]">
          <Icon width={28} height={28} />
          <span className="absolute -right-1 top-0 font-display text-sm italic text-gold-deep/70">{s.num}</span>
        </span>
        <span className="font-display text-sm italic text-gold-deep/80 lg:hidden">{s.num}</span>
      </div>
      <h3 className="mt-6 font-display text-[26px] font-medium text-ink">{s.title}</h3>
      <p className="mt-2 max-w-[240px] text-[13.5px] leading-relaxed text-ink/55">{s.desc}</p>
    </div>
  )
}
