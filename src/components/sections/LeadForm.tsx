import { useState } from 'react'
import { CITIES, PRICE_RANGES, PROPERTY_CATEGORIES, BEDROOM_OPTS } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { IconCheck, IconArrowRight } from '../ui/icons'

interface FormState {
  name: string
  email: string
  phone: string
  lookingTo: string
  location: string
  budget: string
  type: string
  bedrooms: string
  message: string
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  lookingTo: 'Buy',
  location: '',
  budget: '',
  type: '',
  bedrooms: '',
  message: '',
}

export default function LeadForm({ onNotify }: { onNotify: (msg: string) => void }) {
  const [f, setF] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const { ref, cls } = useReveal()

  const set = (k: keyof FormState, v: string) => {
    setF((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (f.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email.'
    if (!/^[+\d][\d\s-]{7,14}$/.test(f.phone.trim())) e.phone = 'Please enter a valid phone number.'
    if (!f.location) e.location = 'Select a preferred location.'
    if (!f.budget) e.budget = 'Select a budget range.'
    if (!f.type) e.type = 'Select a property type.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('loading')
    // Structured payload — ready to POST to n8n / Google Sheets / CRM / email webhook.
    const payload = { source: 'nexora-website', submittedAt: new Date().toISOString(), ...f }
    try {
      await new Promise((r) => setTimeout(r, 1100))
      if (import.meta.env.VITE_LEAD_WEBHOOK_URL) {
        await fetch(import.meta.env.VITE_LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setStatus('success')
      onNotify('Enquiry received — our expert will call you within 24 hours.')
    } catch {
      setStatus('idle')
      onNotify('Something went wrong. Please try again or call us directly.')
    }
  }

  if (status === 'success') {
    return (
      <section id="lead-form" className="relative overflow-hidden bg-ink py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-hairline" />
        <div className="container-lux max-w-3xl text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <IconCheck width={30} height={30} />
          </span>
          <h2 className="mt-8 font-display text-[clamp(30px,4vw,46px)] text-ivory">
            Thank You, <span className="text-gradient-gold">{f.name.split(' ')[0]}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ivory/60">
            Your request has been received. A Nexora property expert will reach out within 24 hours with curated
            options for {f.location || 'your preferred location'}.
          </p>
          <button
            onClick={() => {
              setF(EMPTY)
              setStatus('idle')
            }}
            className="btn-ghost mt-9"
          >
            Submit Another Enquiry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="lead-form" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-hairline" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[420px] rounded-full bg-gold/[0.05] blur-[120px]" />

      <div ref={ref} className={`${cls} container-lux grid gap-14 lg:grid-cols-[0.85fr_1.15fr]`}>
        <div>
          <span className="eyebrow">Property Enquiry</span>
          <h2 className="mt-5 font-display text-[clamp(32px,4vw,50px)] font-medium leading-[1.06] text-ivory">
            Request Property
            <br />
            <span className="text-gradient-gold">Assistance</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ivory/60">
            Share a few details and our experts will curate a shortlist tailored to you — with private viewings and
            full legal support.
          </p>
          <ul className="mt-8 space-y-3.5">
            {['Verified listings only', 'Zero brokerage on first visit', 'Dedicated relationship manager'].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-ivory/70">
                <span className="grid size-6 place-items-center rounded-full bg-gold/15 text-gold">
                  <IconCheck width={12} height={12} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} noValidate className="glass rounded-2xl p-6 sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" error={errors.name}>
              <input className="field-dark" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className="field-dark" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input className="field-dark" type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
            </Field>
            <Field label="Looking To">
              <div className="flex gap-2">
                {['Buy', 'Invest', 'Rent'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set('lookingTo', o)}
                    className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-all duration-300 ${
                      f.lookingTo === o ? 'border-gold bg-gold/15 text-gold-light' : 'border-white/12 text-ivory/60 hover:border-white/25'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Preferred Location" error={errors.location}>
              <select className="field-dark" value={f.location} onChange={(e) => set('location', e.target.value)}>
                <option value="" className="bg-midnight">Select location</option>
                {CITIES.filter((c) => c !== 'All Locations').map((c) => (
                  <option key={c} className="bg-midnight">{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Budget" error={errors.budget}>
              <select className="field-dark" value={f.budget} onChange={(e) => set('budget', e.target.value)}>
                <option value="" className="bg-midnight">Select budget</option>
                {PRICE_RANGES.filter((p) => p !== 'Any Budget').map((p) => (
                  <option key={p} className="bg-midnight">{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Property Type" error={errors.type}>
              <select className="field-dark" value={f.type} onChange={(e) => set('type', e.target.value)}>
                <option value="" className="bg-midnight">Select type</option>
                {PROPERTY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} className="bg-midnight">{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Bedrooms">
              <select className="field-dark" value={f.bedrooms} onChange={(e) => set('bedrooms', e.target.value)}>
                <option value="" className="bg-midnight">Select bedrooms</option>
                {BEDROOM_OPTS.map((b) => (
                  <option key={b} className="bg-midnight">{b}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Message">
              <textarea
                className="field-dark min-h-[110px] resize-y"
                value={f.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Tell us anything else that matters — preferred floors, amenities, timelines…"
              />
            </Field>
          </div>

          <button type="submit" disabled={status === 'loading'} className="btn-gold mt-7 w-full disabled:opacity-70">
            {status === 'loading' ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                Sending Request…
              </>
            ) : (
              <>
                Request Property Assistance
                <IconArrowRight width={16} height={16} />
              </>
            )}
          </button>
          <p className="mt-4 text-center text-[11.5px] text-ivory/40">
            By submitting, you agree to be contacted by our property experts. Your details stay private.
          </p>
        </form>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-ivory/55">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[12px] text-[#E08B72]">{error}</span>}
    </label>
  )
}
