import { useEffect, useRef, useState, memo } from 'react'
import gsap from 'gsap'

const topProjects = [
  {
    id: 1,
    name: 'SALVAGE',
    category: 'Fragrance Brand Design',
    year: '2026',
    image: '/images/projects/salvage.jpg',
  },
  {
    id: 2,
    name: 'FarmCare',
    category: 'Mobile App UI/UX',
    year: '2026',
    image: '/images/projects/farmcare.jpg',
  },
  {
    id: 3,
    name: 'BEVAH Health',
    category: 'Healthcare Platform',
    year: '2026',
    image: '/images/projects/bevah-health.jpg',
  },
  {
    id: 7,
    name: 'Web Landing UI',
    category: 'Web Design / Landing Page',
    year: '2026',
    image: '/images/projects/web-landing-ui.jpg',
  },
  {
    id: 8,
    name: 'Foodly Mobile App',
    category: 'Mobile App UI/UX',
    year: '2026',
    image: '/images/projects/foodly-mobile-app.jpg',
  },
  {
    id: 9,
    name: 'Finance Dashboard',
    category: 'Business Intelligence / Dashboard',
    year: '2026',
    image: '/images/projects/finance-dashboard.jpg',
  },
]

const bottomProjects = [
  {
    id: 4,
    name: 'Dashboard UI',
    category: 'Data Dashboard / Admin Panel',
    year: '2026',
    image: '/images/projects/vivian-beauty.jpg',
  },
  {
    id: 5,
    name: 'Emuchat AI',
    category: 'AI Chat / Mobile App UI',
    year: '2026',
    image: '/images/projects/excellence-homes.jpg',
  },
  {
    id: 6,
    name: 'Duolingo UI',
    category: 'Language Learning / Mobile UI',
    year: '2026',
    image: '/images/projects/daisy-skin.jpg',
  },
  {
    id: 10,
    name: 'Velmora',
    category: 'E-commerce Website / Fashion',
    year: '2026',
    image: '/images/projects/anime-character.jpg',
  },
  {
    id: 11,
    name: 'Flight Booking UI',
    category: 'Travel App / Mobile UI/UX',
    year: '2026',
    image: '/images/projects/flight-booking-ui.jpg',
  },
  {
    id: 12,
    name: 'Business Card Suite',
    category: 'Print / Brand Collateral',
    year: '2026',
    image: '/images/projects/business-card-01.jpg',
  },
  {
    id: 13,
    name: 'Business Card Collection',
    category: 'Print / Brand Identity',
    year: '2026',
    image: '/images/projects/business-card-02.jpg',
  },
  {
    id: 14,
    name: 'Business Card Premium',
    category: 'Print / Luxury Branding',
    year: '2026',
    image: '/images/projects/business-card-03.jpg',
  },
]

const ProjectCard = memo(function ProjectCard({
  project,
  isHovered,
  isAnyHovered,
  onMouseEnter,
  onMouseLeave,
  variant,
  index,
  aspectClass,
}: {
  project: (typeof topProjects)[0]
  isHovered: boolean
  isAnyHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  variant: 'light' | 'dark'
  index: number
  aspectClass: string
}) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`project-card ${index % 2 === 0 ? 'project-card-left' : 'project-card-right'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`group relative rounded-2xl overflow-hidden cursor-pointer will-change-transform transition-[transform,filter] duration-400 ease-out ${
          isDark ? '' : 'liquid-glass-light shadow-lg'
        } ${isHovered ? 'scale-[1.02]' : isAnyHovered ? 'brightness-[0.55]' : 'scale-100 brightness-100'}`}
      >
        <div className={`relative overflow-hidden ${aspectClass}`}>
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 will-change-transform"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: isDark
                ? 'linear-gradient(to top, rgba(15,15,25,0.95) 0%, rgba(15,15,25,0.3) 50%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 45%, transparent 100%)',
              opacity: isHovered ? 1 : 0.85,
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
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
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
})

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

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
        { opacity: 0, y: isMobile ? 25 : 50 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.7 : 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const cards = gsap.utils.toArray<HTMLElement>('.project-card')
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: isMobile ? 40 : 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isMobile ? 0.5 : 0.8,
            delay: isMobile ? 0 : i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      const leftCards = gsap.utils.toArray<HTMLElement>('.project-card-left')
      const rightCards = gsap.utils.toArray<HTMLElement>('.project-card-right')

      leftCards.forEach((card) => {
        gsap.to(card, {
          yPercent: isMobile ? -4 : -8,
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
          yPercent: isMobile ? -6 : -15,
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
      className="relative w-full overflow-hidden will-change-transform -mt-8 z-[11]"
    >
      {/* Top zone: Nezuko background */}
      <div className="relative py-14 md:py-24">
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
                isHovered={hoveredId === project.id}
                isAnyHovered={hoveredId !== null}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
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
                isHovered={hoveredId === project.id}
                isAnyHovered={hoveredId !== null}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
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
