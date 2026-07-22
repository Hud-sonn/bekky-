import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return
    }

    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    gsap.set([cursor, dot], { xPercent: -50, yPercent: -50, opacity: 0 })

    // Throttled mousemove using requestAnimationFrame — avoids creating 120 GSAP tweens/sec
    let rafId = 0
    let lastX = 0
    let lastY = 0
    let needsUpdate = false

    const moveCursor = (e: MouseEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      needsUpdate = true
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (needsUpdate) {
            // Use set() for instant follow on dot, set with slight tween for cursor ring
            gsap.set(dot, { x: lastX, y: lastY })
            gsap.to(cursor, {
              x: lastX,
              y: lastY,
              duration: 0.15,
              ease: 'power2.out',
              overwrite: true,
            })
            needsUpdate = false
          }
          rafId = 0
        })
      }
    }

    const handleMouseEnter = () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.3, overwrite: true })
    }

    const handleMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3, overwrite: true })
    }

    const handleHoverStart = () => {
      // Use scale transform instead of width/height to avoid layout recalc
      gsap.to(cursor, {
        scale: 1.5,
        background: 'rgba(0, 180, 216, 0.15)',
        borderColor: 'rgba(0, 180, 216, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const handleHoverEnd = () => {
      gsap.to(cursor, {
        scale: 1,
        background: 'transparent',
        borderColor: 'rgba(0, 180, 216, 0.8)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    document.addEventListener('mousemove', moveCursor, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Event delegation — works for elements that mount at any time
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-cursor-expand]')) {
        handleHoverStart()
      }
    }
    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-cursor-expand]')) {
        handleHoverEnd()
      }
    }
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(0, 180, 216, 0.8)',
          background: 'transparent',
          opacity: 0,
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#00B4D8',
          boxShadow: '0 0 15px #00B4D8',
          opacity: 0,
        }}
      />
    </>
  )
}
