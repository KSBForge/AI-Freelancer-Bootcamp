import { useEffect, useRef, type ReactNode } from 'react'
import { IconClose } from './icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy?: string
  wide?: boolean
}

export default function Modal({ open, onClose, children, labelledBy, wide }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <button
        aria-label="Close overlay"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-md animate-[fadeIn_.3s_ease]"
      />
      <div
        ref={ref}
        className={`relative w-full ${wide ? 'max-w-5xl' : 'max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/10 bg-charcoal shadow-lux animate-[modalIn_.5s_cubic-bezier(.22,1,.36,1)] no-scrollbar`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-ink/60 text-ivory backdrop-blur transition hover:border-gold/60 hover:text-gold"
        >
          <IconClose width={18} height={18} />
        </button>
        {children}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes modalIn{from{opacity:0;transform:translateY(30px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}
