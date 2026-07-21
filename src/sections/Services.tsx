import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const services = [
  {
    number: '01',
    title: 'UI/UX DESIGN',
    description:
      'Crafting intuitive and visually engaging digital experiences focused on usability, interaction, and modern aesthetics.',
  },
  {
    number: '02',
    title: 'WEB DESIGN',
    description:
      'Designing responsive and high-performing websites that combine creativity, functionality, and seamless user experience.',
  },
  {
    number: '03',
    title: 'GRAPHIC DESIGN',
    description:
      'Creating bold and impactful visual designs that communicate brand identity across digital and print platforms.',
  },
  {
    number: '04',
    title: 'GFX DESIGN',
    description:
      'Producing dynamic graphic visuals, motion-inspired assets, and creative digital artwork that capture attention instantly.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Only do 3D rotateX on desktop — too heavy on mobile
      const isMobile = window.innerWidth < 768

      if (!isMobile) {
        gsap.fromTo(
          containerRef.current,
          { rotateX: 30 },
          {
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 25%',
              end: 'bottom 75%',
              scrub: true,
            },
          }
        )
      }

      gsap.fromTo(
        titleRef.current,
        { yPercent: -30 },
        {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      itemsRef.current.forEach((item, index) => {
        if (!item) return

        const textEl = item.querySelector('.service-text')
        const numEl = item.querySelector('.service-num')
        const descEl = item.querySelector('.service-desc')

        gsap.fromTo(
          item,
          { opacity: 0, x: isMobile ? -30 : -60 },
          {
            opacity: 1,
            x: 0,
            duration: isMobile ? 0.6 : 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Single ScrollTrigger per item — color highlight on active
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => {
            const isActive = self.isActive
            gsap.to(textEl, {
              color: isActive ? '#111' : '#444',
              duration: 0.4,
              overwrite: true,
            })
            gsap.to(numEl, {
              color: isActive ? '#111' : '#444',
              scale: isActive ? 1.05 : 1,
              duration: 0.4,
              overwrite: true,
            })
            gsap.to(descEl, {
              opacity: isActive ? 1 : 0.5,
              duration: 0.4,
              overwrite: true,
            })
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full py-20 md:py-40 overflow-hidden bg-white rounded-t-[2rem] md:rounded-t-[4rem] -mt-8 z-20"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.08), transparent)',
        }}
      />

      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-12"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-black mb-12 md:mb-24 text-center will-change-transform"
        >
          Services
        </h2>

        <div className="space-y-6 md:space-y-12">
          {services.map((service, index) => (
            <div
              key={service.number}
              ref={(el) => {
                if (el) itemsRef.current[index] = el
              }}
              className="group relative flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-10 py-5 md:py-8 border-b border-black/10 cursor-default"
            >
              <span
                className="service-num font-display text-4xl sm:text-5xl md:text-7xl font-bold transition-all duration-400 flex-shrink-0"
                style={{ color: '#444', minWidth: 80 }}
              >
                {service.number}
              </span>

              <div className="flex-1">
                <h3
                  className="service-text font-display text-xl sm:text-2xl md:text-4xl font-bold transition-all duration-400 uppercase tracking-tight"
                  style={{ color: '#444' }}
                >
                  {service.title}
                </h3>
                <p
                  className="service-desc mt-2 text-black/50 text-sm md:text-base max-w-2xl transition-all duration-400"
                  style={{ opacity: 0.5 }}
                >
                  {service.description}
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-black/15 group-hover:border-black/40 group-hover:bg-black/5 transition-all duration-400 flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-black/30 group-hover:text-black/70 transition-colors"
                >
                  <path
                    d="M7 14L13 10L7 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(0, 0, 0, 0.06), transparent)',
        }}
      />
    </section>
  )
}
