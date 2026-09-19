import { useEffect, useRef, useState, type RefObject } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)

export const deviceTier = (): 'full' | 'reduced' | 'minimal' => {
  if (prefersReducedMotion()) return 'minimal'
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    return 'reduced'
  return 'full'
}

export const useMedia = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const usePrefersReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

/** Reveals an element with a fade/rise the first time it enters the viewport. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.16) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, visible, cls: `reveal ${visible ? 'reveal-in' : ''}` }
}

/** Count-up number animation triggered when element enters viewport. */
export function useCountUp(target: number, duration = 1800, startOn = true) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    if (!startOn) return
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setVal(target)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration)
          const eased = 1 - Math.pow(1 - p, 4)
          setVal(Math.round(target * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration, startOn])
  return { ref, val }
}

/** 3D tilt on pointer move for cards. Disabled on touch / reduced motion. */
export function useTilt<T extends HTMLElement>(max = 8, scale = 1.015) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (isTouch() || prefersReducedMotion()) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [max, scale])
  return ref
}

/** Magnetic hover: element is gently attracted toward the cursor. */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (isTouch() || prefersReducedMotion()) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])
  return ref
}

/** Smooth count of window scrollY via rAF. */
export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setY(window.scrollY))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return y
}

/** Lock page scroll while modals are open (works with Lenis). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const w = window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    w.__lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      w.__lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }, [locked])
}

export type CursorMode = 'default' | 'link' | 'view' | 'explore'
export const CursorCtx = { current: 'default' as CursorMode }
