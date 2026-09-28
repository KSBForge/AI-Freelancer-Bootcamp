import Modal from '../ui/Modal'
import { HERO_IMAGES } from '../../data/site'
import { IconPlay } from '../ui/icons'

export default function StoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} wide labelledBy="story-title">
      <div className="relative">
        <img src={HERO_IMAGES.hero} alt="Nexora story" className="h-[300px] w-full rounded-t-2xl object-cover sm:h-[420px]" />
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-charcoal via-ink/30 to-ink/20" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="relative grid size-20 place-items-center rounded-full border border-white/40 bg-ink/50 backdrop-blur">
            <IconPlay width={22} height={22} className="ml-1 text-ivory" />
            <span className="absolute inset-0 animate-ping-soft rounded-full border border-gold/50" />
          </span>
        </div>
        <h3 id="story-title" className="absolute bottom-5 left-6 font-display text-3xl text-ivory sm:text-4xl">
          The Nexora Story
        </h3>
      </div>
      <div className="p-7 sm:p-9">
        <p className="font-display text-[22px] leading-relaxed text-ivory/90">
          “Every skyline we shape begins with a belief — that a home is the foundation of a brighter you.”
        </p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ivory/60">
          Since our first project, Nexora has grown from a boutique brokerage into a full-stack real estate
          experience: development advisory, investment management, and a client-first promise that has served over
          ten thousand families across India.
        </p>
        <div className="mt-7 grid grid-cols-3 gap-4">
          {[
            ['2012', 'Founded in Mumbai'],
            ['15+', 'Cities served'],
            ['10K+', 'Families home'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-center">
              <p className="font-display text-2xl text-gradient-gold">{v}</p>
              <p className="mt-1 text-[12px] text-ivory/55">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
