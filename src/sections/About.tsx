import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      // Guarantee clipped state before scrollTrigger evaluates
      gsap.set(sectionRef.current, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' })

      // Diagonal clip-path reveal — shorter on mobile
      gsap.fromTo(
        sectionRef.current,
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: isMobile ? 0.8 : 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.to(imageRef.current, {
        yPercent: isMobile ? -8 : -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: isMobile ? 30 : 60 },
        {
          opacity: 1,
          x: 0,
          duration: isMobile ? 0.7 : 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: isMobile ? 20 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: isMobile ? 0.7 : 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        '.about-logo',
        { opacity: 0, scale: 0.85, rotateY: isMobile ? -10 : -30 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: isMobile ? 0.8 : 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Pause video when off-screen to save GPU decode
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0 }
    )

    observer.observe(sectionRef.current!)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden py-16 md:py-32 -mt-8 z-[10]"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%] will-change-transform"
        style={{
          backgroundImage: 'url(/images/hashiras.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />

      {/* Dark scrim to prevent blue blur bleed from backdrop-filter */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-10 md:gap-20">
        <div className="about-logo flex-shrink-0" style={{ perspective: 1000 }}>
          <div
            className="relative w-40 h-40 md:w-64 md:h-64 rounded-2xl overflow-hidden liquid-glass-morphic"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
            }}
          >
            <video
              ref={videoRef}
              src="/videos/nezuko.mp4"
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left liquid-glass-morphic rounded-2xl p-8 md:p-10">
          <h2
            ref={titleRef}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            About Me
          </h2>

          <div ref={textRef} className="space-y-6">
            <p
              className="text-lg md:text-xl text-white leading-relaxed font-medium"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85)' }}
            >
              I'm Bekky, a UI/UX designer and brand owner focused on building clean, modern, and user-centered digital experiences.
            </p>

            <p
              className="text-lg md:text-xl text-white leading-relaxed font-medium"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.85)' }}
            >
              Through <span className="font-semibold text-white">BEVAH Studio</span>, I design
              interfaces and brand systems that combine creativity, clarity, and purpose to help
              brands stand out online.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="liquid-glass-morphic rounded-lg px-5 py-3 text-center min-w-[120px]">
                <span
                  className="block text-2xl font-bold text-white"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                >
                  50+
                </span>
                <span className="text-sm text-white/90">Projects Done</span>
              </div>
              <div className="liquid-glass-morphic rounded-lg px-5 py-3 text-center min-w-[120px]">
                <span
                  className="block text-2xl font-bold text-white"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                >
                  3+
                </span>
                <span className="text-sm text-white/90">Years Experience</span>
              </div>
              <div className="liquid-glass-morphic rounded-lg px-5 py-3 text-center min-w-[120px]">
                <span
                  className="block text-2xl font-bold text-white"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                >
                  30+
                </span>
                <span className="text-sm text-white/90">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
