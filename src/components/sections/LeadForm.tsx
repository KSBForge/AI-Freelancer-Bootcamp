import { useState } from 'react'
import { CITIES, PRICE_RANGES, PROPERTY_CATEGORIES, BEDROOM_OPTS } from '../../data/site'
import { useReveal } from '../../lib/hooks'
import { IconCheck, IconArrowRight } from '../ui/icons'

/* ------------------------------------------------------------------ */
/* Form model — keys mirror the webhook payload exactly               */
/* ------------------------------------------------------------------ */
interface FormState {
  name: string
  email: string
  phone: string
  looking_to: string
  preferred_location: string
  budget: string
  property_type: string
  bedrooms: string
  timeline: string
  preferred_contact: string
  message: string
  consent: boolean
}

const TIMELINE_OPTS = [
  'Immediately',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Just exploring',
] as const

const CONTACT_METHODS = ['WhatsApp', 'Phone Call', 'Email'] as const

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  looking_to: 'Buy',
  preferred_location: '',
  budget: '',
  property_type: '',
  bedrooms: '',
  timeline: '',
  preferred_contact: '',
  message: '',
  consent: false,
}

/* ------------------------------------------------------------------ */
/* NEXORA AUTOMATION WEBHOOK                                          */
/* ------------------------------------------------------------------ */
/* Paste your n8n Production Webhook URL here when the workflow is    */
/* ready. While it is empty, nothing is sent anywhere — the form      */
/* resolves locally with the premium success state. No secrets or     */
/* API keys belong in this frontend file.                             */
const N8N_WEBHOOK_URL = ''

/* ------------------------------------------------------------------ */
export default function LeadForm({ onNotify }: { onNotify: (msg: string) => void }) {
  const [f, setF] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const { ref, cls } = useReveal()

  const set = (k: keyof FormState, v: string | boolean) => {
    setF((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}

    if (f.name.trim().length < 2) e.name = 'Please enter your full name.'

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'

    if (!/^[+\d][\d\s-]{7,14}$/.test(f.phone.trim())) e.phone = 'Please enter a valid phone number.'

    if (!f.looking_to) e.looking_to = 'Select an option.'
    if (!f.preferred_location) e.preferred_location = 'Select a preferred location.'
    if (!f.budget) e.budget = 'Select a budget range.'
    if (!f.property_type) e.property_type = 'Select a property type.'
    if (!f.timeline) e.timeline = 'Select your move-in timeline.'
    if (!f.preferred_contact) e.preferred_contact = 'Select your preferred contact method.'
    if (!f.consent) e.consent = 'Please agree to be contacted so we can respond to your enquiry.'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (status === 'loading') return // guard against duplicate submissions
    if (!validate()) return

    setStatus('loading')

    // Single structured payload — automation-ready (n8n webhook / CRM / Sheets).
    const payload = {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      looking_to: f.looking_to,
      preferred_location: f.preferred_location,
      budget: f.budget,
      property_type: f.property_type,
      bedrooms: f.bedrooms,
      timeline: f.timeline,
      preferred_contact: f.preferred_contact,
      message: f.message.trim(),
      consent: f.consent,
    }

    try {
      // NEXORA AUTOMATION WEBHOOK
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      setStatus('success')
      onNotify('Enquiry received — our property specialist will contact you shortly.')
    } catch {
      setStatus('idle')
      onNotify('Something went wrong. Please try again or call us directly.')
    }
  }

  const reset = () => {
    setF(EMPTY)
    setErrors({})
    setStatus('idle')
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
            Thank <span className="text-gradient-gold">You</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ivory/60">
            Your property enquiry has been received. Our property specialist will review your requirements and
            contact you shortly.
          </p>
          <button onClick={reset} className="btn-ghost mt-9">
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
            <Field label="Looking To" error={errors.looking_to}>
              <div className="flex gap-2">
                {['Buy', 'Invest', 'Rent'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set('looking_to', o)}
                    className={`flex-1 rounded-lg border px-3 py-3 text-sm transition-all duration-300 ${
                      f.looking_to === o ? 'border-gold bg-gold/15 text-gold-light' : 'border-white/12 text-ivory/60 hover:border-white/25'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Preferred Location" error={errors.preferred_location}>
              <select className="field-dark" value={f.preferred_location} onChange={(e) => set('preferred_location', e.target.value)}>
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
            <Field label="Property Type" error={errors.property_type}>
              <select className="field-dark" value={f.property_type} onChange={(e) => set('property_type', e.target.value)}>
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

            {/* NEW: move-in timeline */}
            <Field label="When are you looking to move?" error={errors.timeline}>
              <select className="field-dark" value={f.timeline} onChange={(e) => set('timeline', e.target.value)}>
                <option value="" className="bg-midnight">Select timeline</option>
                {TIMELINE_OPTS.map((t) => (
                  <option key={t} className="bg-midnight">{t}</option>
                ))}
              </select>
            </Field>

            {/* NEW: preferred contact method */}
            <Field label="Preferred Contact Method" error={errors.preferred_contact}>
              <div className="grid grid-cols-3 gap-2">
                {CONTACT_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => set('preferred_contact', m)}
                    className={`rounded-lg border px-2 py-3 text-[13px] transition-all duration-300 ${
                      f.preferred_contact === m ? 'border-gold bg-gold/15 text-gold-light' : 'border-white/12 text-ivory/60 hover:border-white/25'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
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

          {/* NEW: required consent */}
          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={f.consent}
                onChange={(e) => set('consent', e.target.checked)}
                className="mt-0.5 size-[17px] shrink-0 cursor-pointer appearance-none rounded border border-white/25 bg-white/[0.05] transition-all duration-300 checked:border-gold checked:bg-gold"
                style={{
                  backgroundImage: f.consent
                    ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2307090d' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")"
                    : undefined,
                  backgroundSize: '12px 12px',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <span className="text-[13px] leading-relaxed text-ivory/65">
                I agree to be contacted regarding my property enquiry.
              </span>
            </label>
            {errors.consent && (
              <span className="mt-1.5 block pl-8 text-[12px] text-[#E08B72]">{errors.consent}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            aria-busy={status === 'loading'}
            className="btn-gold mt-7 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
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
