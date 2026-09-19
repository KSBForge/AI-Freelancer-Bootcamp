import { useState } from 'react'
import { useReveal } from '../../lib/hooks'
import { IconArrowRight, IconCheck, IconMail, IconTag, IconChart } from '../ui/icons'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'loading' | 'done'>('idle')
  const { ref, cls } = useReveal()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error')
      return
    }
    setState('loading')
    await new Promise((r) => setTimeout(r, 900))
    setState('done')
  }

  return (
    <section className="relative overflow-hidden bg-charcoal py-24">
      <div data-parallax className="absolute inset-[-12%] opacity-25">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1800&auto=format&fit=crop"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/50" />

      <div ref={ref} className={`${cls} container-lux relative grid items-center gap-12 lg:grid-cols-[1fr_1.2fr_0.8fr]`}>
        <div>
          <span className="eyebrow">Stay Updated</span>
          <h2 className="mt-5 font-display text-[clamp(30px,3.8vw,46px)] font-medium leading-[1.06] text-ivory">
            Get the Latest
            <br />
            Property <span className="text-gradient-gold">Updates</span>
          </h2>
        </div>

        <div>
          {state === 'done' ? (
            <div className="glass-gold flex items-center gap-4 rounded-xl p-5">
              <span className="grid size-11 place-items-center rounded-full bg-gold text-ink">
                <IconCheck width={20} height={20} />
              </span>
              <div>
                <p className="font-display text-lg text-ivory">You're on the list.</p>
                <p className="text-[13px] text-ivory/55">Expect curated listings and market insights soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="mb-4 max-w-md text-[14.5px] leading-relaxed text-ivory/60">
                Subscribe to our newsletter and be the first to know about new listings, exclusive offers, and real
                estate insights.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className={`flex flex-1 items-center gap-3 rounded-lg border bg-ink/40 px-4 py-3.5 transition ${state === 'error' ? 'border-[#E08B72]' : 'border-white/12 focus-within:border-gold/60'}`}>
                  <IconMail width={17} height={17} className="text-ivory/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state === 'error') setState('idle')
                    }}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/35"
                    aria-label="Email address"
                  />
                </div>
                <button type="submit" disabled={state === 'loading'} className="btn-gold shrink-0 disabled:opacity-70">
                  {state === 'loading' ? 'Subscribing…' : (
                    <>
                      Subscribe
                      <IconArrowRight width={15} height={15} />
                    </>
                  )}
                </button>
              </div>
              {state === 'error' && <p className="mt-2 text-[12.5px] text-[#E08B72]">Please enter a valid email address.</p>}
            </form>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 lg:pl-8">
          {[
            { icon: <IconTag width={20} height={20} />, label: 'Exclusive Listings' },
            { icon: <IconTag width={20} height={20} />, label: 'Special Offers' },
            { icon: <IconChart width={20} height={20} />, label: 'Market Insights' },
          ].map((x) => (
            <div key={x.label} className="flex flex-col items-center gap-2.5 text-center">
              <span className="grid size-12 place-items-center rounded-full border border-gold/30 text-gold">{x.icon}</span>
              <span className="text-[11.5px] leading-snug text-ivory/55">{x.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
