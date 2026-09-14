import { useEffect, useRef } from 'react'

type Dot = {
  id: number
  x: number
  y: number
  born: number
  size: number
  tone: 'coral' | 'acid' | 'paper' | 'blue'
}

const DOT_COUNT = 18
const DOT_LIFE_MS = 1100

const TONE_RGB: Record<Dot['tone'], string> = {
  coral: '255, 118, 95',
  acid: '216, 255, 106',
  paper: '243, 236, 214',
  blue: '155, 188, 255',
}

export function InkTrail() {
  const dotsRef = useRef<Dot[]>([])
  const idRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number | null>(null)
  const lxRef = useRef(0)
  const lyRef = useRef(0)
  const cxRef = useRef(0)
  const cyRef = useRef(0)
  const dimsRef = useRef({ w: 1, h: 1 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const noHover = window.matchMedia('(hover: none)').matches
    if (noHover) return

    const svg = svgRef.current
    if (!svg) return

    const syncSize = () => {
      dimsRef.current = { w: window.innerWidth, h: window.innerHeight }
      svg.setAttribute('viewBox', `0 0 ${dimsRef.current.w} ${dimsRef.current.h}`)
    }
    syncSize()
    window.addEventListener('resize', syncSize)

    const onMove = (event: MouseEvent) => {
      const now = performance.now()
      lxRef.current = cxRef.current
      lyRef.current = cyRef.current
      cxRef.current = event.clientX
      cyRef.current = event.clientY
      if (now - lastSpawnRef.current < 22) return
      lastSpawnRef.current = now
      const id = idRef.current++
      const distance = Math.hypot(cxRef.current - lxRef.current, cyRef.current - lyRef.current)
      const size = 1.4 + Math.min(2.4, distance * 0.08) + Math.random() * 0.6
      const pick = Math.random()
      const tone: Dot['tone'] =
        pick < 0.5 ? 'coral' : pick < 0.78 ? 'acid' : pick < 0.92 ? 'paper' : 'blue'
      dotsRef.current.push({ id, x: event.clientX, y: event.clientY, born: now, size, tone })
      if (dotsRef.current.length > DOT_COUNT) dotsRef.current.splice(0, dotsRef.current.length - DOT_COUNT)
    }

    const onLeave = () => {
      cxRef.current = -100
      cyRef.current = -100
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)

    const tick = () => {
      const now = performance.now()
      dotsRef.current = dotsRef.current.filter(dot => now - dot.born < DOT_LIFE_MS)
      let inner = ''
      for (const dot of dotsRef.current) {
        const age = (now - dot.born) / DOT_LIFE_MS
        if (age >= 1) continue
        const ease = 1 - Math.pow(1 - age, 2.4)
        const r = dot.size * (1 - ease * 0.4)
        const opacity = 0.62 * (1 - ease)
        const color = TONE_RGB[dot.tone]
        inner += `<circle cx="${dot.x.toFixed(2)}" cy="${dot.y.toFixed(2)}" r="${r.toFixed(2)}" fill="rgba(${color}, ${opacity.toFixed(3)})" />`
        if (dot.size > 2) {
          inner += `<circle cx="${dot.x.toFixed(2)}" cy="${dot.y.toFixed(2)}" r="${(r * 0.4).toFixed(2)}" fill="rgba(243, 236, 214, ${(opacity * 0.45).toFixed(3)})" />`
        }
      }
      if (svg.innerHTML !== inner) svg.innerHTML = inner
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', syncSize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="ink-trail"
      preserveAspectRatio="none"
      aria-hidden="true"
    />
  )
}