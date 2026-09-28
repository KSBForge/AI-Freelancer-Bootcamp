import { useState } from 'react'
import Modal from '../ui/Modal'
import { CITIES } from '../../data/site'
import { IconCheck, IconCalendar, IconArrowRight } from '../ui/icons'

export default function VisitModal({ open, onClose, onNotify }: { open: boolean; onClose: () => void; onNotify: (m: string) => void }) {
  const [f, setF] = useState({ name: '', phone: '', city: 'Mumbai', date: '', time: '10:00 AM' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (f.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!/^[+\d][\d\s-]{7,14}$/.test(f.phone.trim())) er.phone = 'Enter a valid phone.'
    if (!f.date) er.date = 'Pick a date.'
    setErrors(er)
    if (Object.keys(er).length) return
    setDone(true)
    onNotify(`Visit scheduled for ${f.date} at ${f.time}. Our team will confirm shortly.`)
  }

  const close = () => {
    onClose()
    setTimeout(() => setDone(false), 300)
  }

  return (
    <Modal open={open} onClose={close} labelledBy="visit-title">
      {done ? (
        <div className="p-9 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <IconCheck width={26} height={26} />
          </span>
          <h3 id="visit-title" className="mt-6 font-display text-3xl text-ivory">
            Visit Scheduled
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-ivory/60">
            {f.name}, our Nexora expert will call {f.phone} to confirm your {f.city} visit on {f.date} at {f.time}.
          </p>
          <button onClick={close} className="btn-gold mt-7 w-full">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="p-7 sm:p-9">
          <span className="eyebrow">Private Tour</span>
          <h3 id="visit-title" className="mt-4 font-display text-3xl text-ivory">
            Schedule a Visit
          </h3>
          <p className="mt-2 text-[13.5px] text-ivory/55">
            Walk the property with a Nexora expert. Free, flexible, no obligation.
          </p>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-ivory/55">Full Name</span>
              <input className="field-dark" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" />
              {errors.name && <span className="mt-1 block text-[12px] text-[#E08B72]">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-ivory/55">Phone</span>
              <input className="field-dark" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+91 98765 43210" />
              {errors.phone && <span className="mt-1 block text-[12px] text-[#E08B72]">{errors.phone}</span>}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-ivory/55">City</span>
                <select className="field-dark" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>
                  {CITIES.filter((c) => c !== 'All Locations').map((c) => (
                    <option key={c} className="bg-midnight">{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] uppercase tracking-[0.16em] text-ivory/55">Time</span>
                <select className="field-dark" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })}>
                  {['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'].map((t) => (
                    <option key={t} className="bg-midnight">{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-ivory/55">
                <IconCalendar width={13} height={13} /> Preferred Date
              </span>
              <input
                className="field-dark"
                type="date"
                value={f.date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setF({ ...f, date: e.target.value })}
              />
              {errors.date && <span className="mt-1 block text-[12px] text-[#E08B72]">{errors.date}</span>}
            </label>
          </div>

          <button type="submit" className="btn-gold mt-7 w-full">
            Confirm Visit Request
            <IconArrowRight width={16} height={16} />
          </button>
        </form>
      )}
    </Modal>
  )
}
