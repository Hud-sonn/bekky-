import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
      gsap.fromTo(
        containerRef.current,
        { rotateX: 45 },
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

      gsap.fromTo(
        titleRef.current,
        { yPercent: -50 },
        {
          yPercent: 50,
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
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            gsap.to(textEl, {
              color: '#03045E',
              textShadow: '0 0 10px rgba(0, 119, 182, 0.3)',
              duration: 0.4,
            })
            gsap.to(numEl, { color: '#03045E', scale: 1.1, duration: 0.4 })
            gsap.to(descEl, { opacity: 1, y: 0, duration: 0.4 })
          },
          onLeave: () => {
            gsap.to(textEl, { color: '#0077B6', textShadow: 'none', duration: 0.4 })
            gsap.to(numEl, { color: '#0077B6', scale: 1, duration: 0.4 })
            gsap.to(descEl, { opacity: 0.5, y: 0, duration: 0.4 })
          },
          onEnterBack: () => {
            gsap.to(textEl, {
              color: '#03045E',
              textShadow: '0 0 10px rgba(0, 119, 182, 0.3)',
              duration: 0.4,
            })
            gsap.to(numEl, { color: '#03045E', scale: 1.1, duration: 0.4 })
            gsap.to(descEl, { opacity: 1, y: 0, duration: 0.4 })
          },
          onLeaveBack: () => {
            gsap.to(textEl, { color: '#0077B6', textShadow: 'none', duration: 0.4 })
            gsap.to(numEl, { color: '#0077B6', scale: 1, duration: 0.4 })
            gsap.to(descEl, { opacity: 0.5, y: 0, duration: 0.4 })
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
      className="relative w-full py-24 md:py-40 overflow-hidden bg-white rounded-t-[3rem] md:rounded-t-[4rem] -mt-8 z-20"
      style={{ perspective: 1000 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(0, 119, 182, 0.25), transparent)',
        }}
      />

      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-12"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2
          ref={titleRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-black mb-16 md:mb-24 text-center"
        >
          Services
        </h2>

        <div className="space-y-8 md:space-y-12">
          {services.map((service, index) => (
            <div
              key={service.number}
              ref={(el) => {
                if (el) itemsRef.current[index] = el
              }}
              className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 py-6 md:py-8 border-b border-black/10 cursor-default"
            >
              <span
                className="service-num font-display text-5xl md:text-7xl font-bold transition-all duration-400 flex-shrink-0"
                style={{ color: '#0077B6', minWidth: 100 }}
              >
                {service.number}
              </span>

              <div className="flex-1">
                <h3
                  className="service-text font-display text-2xl md:text-4xl font-bold transition-all duration-400 uppercase tracking-tight"
                  style={{ color: '#0077B6' }}
                >
                  {service.title}
                </h3>
                <p
                  className="service-desc mt-2 text-black/60 text-sm md:text-base max-w-2xl transition-all duration-400"
                  style={{ opacity: 0.5 }}
                >
                  {service.description}
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-twilight-blue/30 group-hover:border-twilight-blue group-hover:bg-twilight-blue/10 transition-all duration-400 flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-twilight-blue/50 group-hover:text-twilight-blue transition-colors"
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
          background: 'linear-gradient(to right, transparent, rgba(0, 119, 182, 0.2), transparent)',
        }}
      />
    </section>
  )
}
