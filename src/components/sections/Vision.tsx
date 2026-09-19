import { useReveal } from '../../lib/hooks'
import { IconArrowRight, IconLeaf, IconUsers, IconSun } from '../ui/icons'

const ITEMS = [
  { icon: <IconLeaf width={26} height={26} />, label: 'Sustainable Growth' },
  { icon: <IconUsers width={26} height={26} />, label: 'Stronger Communities' },
  { icon: <IconSun width={26} height={26} />, label: 'Brighter Futures' },
]

export default function Vision() {
  const { ref, cls } = useReveal()

  return (
    <section className="bg-ivory py-24 sm:py-28">
      <div ref={ref} className={`${cls} container-lux grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr_0.9fr]`}>
        <div>
          <span className="eyebrow !text-gold-deep">Our Vision</span>
          <h2 className="mt-5 font-display text-[clamp(34px,4.2vw,52px)] font-medium leading-[1.06] text-ink">
            Creating a Better
            <br />
            <span className="text-gradient-gold">Tomorrow</span>
          </h2>
        </div>

        <div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink/60">
            We envision a world where everyone has a place to call home — a space that brings happiness, growth, and
            new opportunities.
          </p>
          <button className="btn-gold mt-7">
            Join Our Journey
            <IconArrowRight width={16} height={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 lg:border-l lg:border-ink/10 lg:pl-10">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="group flex flex-col items-center gap-3 rounded-xl px-2 py-6 text-center transition-colors duration-500 hover:bg-white"
            >
              <span className="text-gold-deep transition-transform duration-500 ease-lux group-hover:-translate-y-1">
                {item.icon}
              </span>
              <span className="text-[12.5px] leading-snug text-ink/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
