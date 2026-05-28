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

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      })
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02,
        ease: 'none',
      })
    }

    const handleMouseEnter = () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.3 })
    }

    const handleHoverStart = () => {
      gsap.to(cursor, {
        width: 60,
        height: 60,
        background: 'rgba(0, 180, 216, 0.15)',
        borderColor: 'rgba(0, 180, 216, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleHoverEnd = () => {
      gsap.to(cursor, {
        width: 40,
        height: 40,
        background: 'transparent',
        borderColor: 'rgba(0, 180, 216, 0.8)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    document.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-expand]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [])

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
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
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
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
