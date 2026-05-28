import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const topProjects = [
  {
    id: 1,
    name: 'SALVAGE',
    category: 'Fragrance Brand Design',
    year: '2025',
    image: '/images/projects/salvage.jpg',
  },
  {
    id: 2,
    name: 'FarmCare',
    category: 'Mobile App UI/UX',
    year: '2025',
    image: '/images/projects/farmcare.jpg',
  },
  {
    id: 3,
    name: 'BEVAH Health',
    category: 'Healthcare Platform',
    year: '2024',
    image: '/images/projects/bevah-health.jpg',
  },
]

const bottomProjects = [
  {
    id: 4,
    name: 'VIVIAN Beauty',
    category: 'Beauty Brand Identity',
    year: '2024',
    image: '/images/projects/vivian-beauty.jpg',
  },
  {
    id: 5,
    name: 'Excellence Homes',
    category: 'Real Estate Branding',
    year: '2024',
    image: '/images/projects/excellence-homes.jpg',
  },
  {
    id: 6,
    name: 'Daisy Skin',
    category: 'Skincare E-commerce',
    year: '2023',
    image: '/images/projects/daisy-skin.jpg',
  },
]

function ProjectCard({
  project,
  hoveredId,
  setHoveredId,
  variant,
  index,
  aspectClass,
}: {
  project: (typeof topProjects)[0]
  hoveredId: number | null
  setHoveredId: (id: number | null) => void
  variant: 'light' | 'dark'
  index: number
  aspectClass: string
}) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`project-card ${index % 2 === 0 ? 'project-card-left' : 'project-card-right'}`}
      onMouseEnter={() => setHoveredId(project.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
          isDark ? '' : 'liquid-glass-light shadow-lg'
        }`}
        style={{
          transform: hoveredId === project.id ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          filter:
            hoveredId !== null && hoveredId !== project.id ? 'brightness(0.55)' : 'brightness(1)',
        }}
      >
        <div className={`relative overflow-hidden ${aspectClass}`}>
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700"
            style={{
              transform: hoveredId === project.id ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: isDark
                ? 'linear-gradient(to top, rgba(3,4,94,0.95) 0%, rgba(3,4,94,0.3) 50%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)',
              opacity: hoveredId === project.id ? 1 : 0.85,
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <span
              className={`text-xs font-mono-data uppercase tracking-widest ${
                isDark ? 'text-cyan-glow/80' : 'text-white/80'
              }`}
            >
              {project.category}
            </span>
            <h3
              className={`font-display text-xl md:text-2xl font-bold mt-1 ${
                isDark ? 'text-ice-mist' : 'text-white'
              }`}
            >
              {project.name}
            </h3>
            <span className={`text-sm mt-1 ${isDark ? 'text-ice-mist/50' : 'text-white/60'}`}>
              {project.year}
            </span>

            <div
              className="mt-4 transition-all duration-500"
              style={{
                opacity: hoveredId === project.id ? 1 : 0,
                transform: hoveredId === project.id ? 'translateY(0)' : 'translateY(10px)',
              }}
            >
              <span className="inline-flex items-center gap-2 text-sm text-cyan-glow font-medium">
                View Project
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scale/fade reveal from 0.97
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0.85, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      )

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const cards = gsap.utils.toArray<HTMLElement>('.project-card')
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      const leftCards = gsap.utils.toArray<HTMLElement>('.project-card-left')
      const rightCards = gsap.utils.toArray<HTMLElement>('.project-card-right')

      leftCards.forEach((card) => {
        gsap.to(card, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      rightCards.forEach((card) => {
        gsap.to(card, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden will-change-transform -mt-8 z-10"
    >
      {/* Top zone: Nezuko background */}
      <div className="relative py-20 md:py-24">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/projects-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.7) 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <h2
            ref={titleRef}
            className="font-display text-5xl md:text-7xl font-bold text-black mb-8 md:mb-12 text-center"
          >
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {topProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                variant="light"
                index={index}
                aspectClass="aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom zone: second project row over about-avatar / moonlit bg */}
      <div className="relative py-12 md:py-16 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(/images/about-avatar.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {bottomProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                variant="dark"
                index={index}
                aspectClass="aspect-[3/4]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
