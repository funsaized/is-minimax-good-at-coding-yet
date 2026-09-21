import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    const node = ref.current
    if (!node) return

    let raf = 0
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 4
    let currentX = targetX
    let currentY = targetY

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      node.style.opacity = '1'
    }
    const onLeave = () => {
      node.style.opacity = '0'
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <span ref={ref} className="app__cursor-glow" aria-hidden="true" />
}
