import { useEffect, useRef, type CSSProperties } from 'react'

type Dot = { x: number; y: number; born: number; alpha: number }

export function CursorGlow() {
  const headRef = useRef<HTMLSpanElement | null>(null)
  const layerRef = useRef<HTMLSpanElement | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const nodesRef = useRef<HTMLSpanElement[]>([])
  const lastDotAt = useRef(0)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const ghostPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isCoarse = window.matchMedia('(hover: none)').matches
    if (reduceMotion.matches || isCoarse) return

    const head = headRef.current
    const layer = layerRef.current
    if (!head || !layer) return

    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 4 }
    current.current = { ...target.current }
    ghostPos.current = { ...target.current }

    const VOICE_TONE_RGB: Record<string, [number, number, number]> = {
      quiet: [168, 197, 255],
      human: [244, 132, 114],
      bold: [205, 238, 106],
    }

    const computeTone = (): [number, number, number] => {
      const root = document.documentElement
      const cls = root.className
      if (cls.includes('app--voice-human')) return VOICE_TONE_RGB.human
      if (cls.includes('app--voice-bold')) return VOICE_TONE_RGB.bold
      return VOICE_TONE_RGB.quiet
    }

    const spawnDot = (x: number, y: number) => {
      const now = performance.now()
      if (now - lastDotAt.current < 28) return
      lastDotAt.current = now
      const tone = computeTone()
      const node = document.createElement('span')
      node.className = 'ink-tip__dot'
      const alpha = 0.45 + Math.random() * 0.25
      node.style.cssText = `left:${x}px;top:${y}px;background:rgba(${tone[0]},${tone[1]},${tone[2]},${alpha});`
      layer.appendChild(node)
      const dot: Dot = { x, y, born: now, alpha }
      dotsRef.current.push(dot)
      nodesRef.current.push(node)
      const maxDots = 18
      while (dotsRef.current.length > maxDots && nodesRef.current.length > 0) {
        const old = nodesRef.current.shift()
        old?.remove()
        dotsRef.current.shift()
      }
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18
      current.current.y += (target.current.y - current.current.y) * 0.18
      const dx = current.current.x - ghostPos.current.x
      const dy = current.current.y - ghostPos.current.y
      const distSq = dx * dx + dy * dy
      if (distSq > 60) {
        ghostPos.current.x += dx * 0.35
        ghostPos.current.y += dy * 0.35
        spawnDot(ghostPos.current.x, ghostPos.current.y)
      } else {
        ghostPos.current.x = current.current.x
        ghostPos.current.y = current.current.y
      }
      const tone = computeTone()
      head.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`
      head.style.borderColor = `rgba(${tone[0]},${tone[1]},${tone[2]},.55)`
      head.style.boxShadow = `0 0 0 1px rgba(${tone[0]},${tone[1]},${tone[2]},.18), 0 4px 18px -6px rgba(${tone[0]},${tone[1]},${tone[2]},.18)`
      const now = performance.now()
      const nodes = nodesRef.current
      const dots = dotsRef.current
      const remainingNodes: HTMLSpanElement[] = []
      const remainingDots: Dot[] = []
      for (let i = 0; i < dots.length; i++) {
        const age = now - dots[i].born
        const life = 950
        if (age > life) {
          nodes[i].remove()
        } else {
          const k = 1 - age / life
          nodes[i].style.opacity = String(Math.max(0, k * dots[i].alpha))
          nodes[i].style.transform = `translate3d(-50%, -50%, 0) scale(${0.6 + k * 0.4})`
          remainingNodes.push(nodes[i])
          remainingDots.push(dots[i])
        }
      }
      nodesRef.current = remainingNodes
      dotsRef.current = remainingDots
      raf = requestAnimationFrame(tick)
    }

    let raf = requestAnimationFrame(tick)

    const onMove = (event: PointerEvent) => {
      target.current.x = event.clientX
      target.current.y = event.clientY
      head.style.opacity = '1'
    }
    const onLeave = () => {
      head.style.opacity = '0'
    }
    const onDown = (event: PointerEvent) => {
      target.current.x = event.clientX
      target.current.y = event.clientY
      current.current = target.current
      for (let i = 0; i < 4; i++) {
        const jx = target.current.x + (Math.random() - 0.5) * 8
        const jy = target.current.y + (Math.random() - 0.5) * 8
        spawnDot(jx, jy)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      nodesRef.current.forEach(n => n.remove())
      nodesRef.current = []
      dotsRef.current = []
    }
  }, [])

  const headStyle = {
    background:
      'radial-gradient(circle at 38% 32%, rgba(245,238,216,.95) 0%, rgba(245,238,216,.65) 35%, rgba(245,238,216,.18) 70%, transparent 100%)',
  } as CSSProperties

  return (
    <span ref={layerRef} className="ink-tip__layer" aria-hidden="true">
      <span ref={headRef} className="ink-tip__head" style={headStyle} />
    </span>
  )
}
