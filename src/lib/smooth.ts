import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './hooks'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (prefersReducedMotion() || lenis) return lenis
  try {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    // The rAF loop must re-schedule itself every frame or Lenis never advances
    // (a single requestAnimationFrame call only runs one frame -> page scroll freezes).
    let raf = 0
    const loop = (time: number) => {
      lenis?.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    lenis.on('scroll', ScrollTrigger.update)
    return lenis
  } catch {
    return null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const w = window as unknown as { __lenis?: Lenis }
  if (w.__lenis && !prefersReducedMotion()) {
    w.__lenis.scrollTo(el, { offset: -70, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }
}

export { gsap, ScrollTrigger }
