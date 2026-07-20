import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface NavigationProps {
  scrollTo: (target: string) => void
}

const navItems = [
  { label: 'Home', target: '#hero' },
  { label: 'About', target: '#about' },
  { label: 'Project', target: '#projects' },
  { label: 'Service', target: '#services' },
  { label: 'Contact', target: '#contact' },
]

export default function Navigation({ scrollTo }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [onLightSection, setOnLightSection] = useState(false)

  useEffect(() => {
    // Cache DOM elements once — avoids getElementById on every scroll frame
    const servicesEl = document.getElementById('services')
    const projectsEl = document.getElementById('projects')

    const handleScroll = () => {
      setScrolled(window.scrollY > 80)

      const scrollY = window.scrollY + 100

      const inServices = servicesEl && scrollY >= servicesEl.offsetTop
      const inProjectsTop =
        projectsEl &&
        scrollY >= projectsEl.offsetTop &&
        servicesEl &&
        scrollY < servicesEl.offsetTop

      setOnLightSection(Boolean(inServices || inProjectsTop))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('load', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('load', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
    )
  }, [])

  const handleNav = (target: string) => {
    setMobileOpen(false)
    scrollTo(target)
  }

  const textColor = onLightSection
    ? 'text-black/80 hover:text-black'
    : 'text-white/85 hover:text-white'
  const logoColor = onLightSection
    ? 'text-black hover:text-black/70'
    : 'text-white hover:text-white/80'

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => handleNav('#hero')}
          className={`font-display text-2xl font-bold tracking-tight transition-colors ${logoColor}`}
        >
          BEKKY
        </button>

        <div
          className={`hidden md:flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500 ${
            onLightSection ? 'liquid-glass-light' : scrolled ? 'liquid-glass-dark' : 'liquid-glass'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.target)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${textColor}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`w-6 h-[2px] transition-all duration-300 ${onLightSection ? 'bg-black' : 'bg-white'} ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`}
          />
          <span
            className={`w-6 h-[2px] transition-all duration-300 ${onLightSection ? 'bg-black' : 'bg-white'} ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`w-6 h-[2px] transition-all duration-300 ${onLightSection ? 'bg-black' : 'bg-white'} ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 mx-2 mt-2 rounded-2xl ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } ${onLightSection ? 'liquid-glass-light' : 'liquid-glass-dark'}`}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.target)}
              className={`text-left py-3 text-lg transition-colors border-b ${
                onLightSection
                  ? 'text-black/80 hover:text-black border-black/10'
                  : 'text-white/80 hover:text-white border-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
