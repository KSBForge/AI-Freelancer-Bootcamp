import { useEffect, useRef, useState } from 'react'
import { CursorCtx, isTouch, type CursorMode } from '../../lib/hooks'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (isTouch()) return
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return
    setEnabled(true)

    let x = -100, y = -100, rx = -100, ry = -100
    let raf = 0
    let mode: CursorMode = 'default'

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      const t = e.target as HTMLElement
      const interactive = t.closest('a,button,[role="button"],input,select,textarea,label')
      const view = t.closest('[data-cursor="view"]')
      const explore = t.closest('[data-cursor="explore"]')
      const next: CursorMode = explore ? 'explore' : view ? 'view' : interactive ? 'link' : 'default'
      if (next !== mode) {
        mode = next
        CursorCtx.current = next
      }
    }

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      const dot = dotRef.current
      const ring = ringRef.current
      const label = labelRef.current
      if (dot && ring && label) {
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`
        if (mode === 'view' || mode === 'explore') {
          ring.style.width = '64px'
          ring.style.height = '64px'
          ring.style.background = 'rgba(200,164,95,0.92)'
          ring.style.borderColor = 'rgba(200,164,95,0.4)'
          label.textContent = mode === 'view' ? 'View' : 'Explore'
          label.style.opacity = '1'
          dot.style.opacity = '0'
        } else if (mode === 'link') {
          ring.style.width = '48px'
          ring.style.height = '48px'
          ring.style.background = 'transparent'
          ring.style.borderColor = 'rgba(200,164,95,0.8)'
          label.style.opacity = '0'
          dot.style.opacity = '1'
        } else {
          ring.style.width = '28px'
          ring.style.height = '28px'
          ring.style.background = 'transparent'
          ring.style.borderColor = 'rgba(244,239,230,0.5)'
          label.style.opacity = '0'
          dot.style.opacity = '1'
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot size-1.5 rounded-full bg-gold" />
      <div
        ref={ringRef}
        className="cursor-dot grid place-items-center rounded-full border border-ivory/50 transition-[width,height,background-color,border-color] duration-300 ease-lux"
      >
        <span
          ref={labelRef}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink opacity-0 transition-opacity duration-200"
        />
      </div>
    </>
  )
}
