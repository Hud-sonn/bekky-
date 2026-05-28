import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  scrollTo: (target: string) => void
}

export default function Hero({ scrollTo }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      )
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )

      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(contentRef.current, {
        opacity: 0,
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      <img
        ref={bgRef}
        src="/images/hero-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        style={{ willChange: 'transform' }}
      />

      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12"
      >
        <div className="max-w-2xl">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 liquid-glass rounded-full px-5 py-2.5 mb-6"
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{
                background: '#22c55e',
                boxShadow: '0 0 10px #22c55e, 0 0 20px rgba(34, 197, 94, 0.5)',
              }}
            />
            <span className="text-sm font-medium text-white/90">
              Available for 2026 Projects
            </span>
          </div>

          <p
            ref={subtitleRef}
            className="text-lg md:text-2xl text-white max-w-xl mb-8 leading-relaxed font-medium"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}
          >
            Creating modern websites, intuitive interfaces, and bold visuals with creativity and purpose.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('#contact')}
              className="px-8 py-3.5 rounded-lg font-semibold text-sm bg-white text-black hover:bg-white/90 transition-all"
            >
              Hire Me
            </button>
            <button
              onClick={() => scrollTo('#projects')}
              className="px-8 py-3.5 rounded-lg font-semibold text-sm border border-white text-white hover:bg-white/10 transition-all"
            >
              Explore Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
