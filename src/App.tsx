import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Intro from './sections/Intro'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Services from './sections/Services'
import Contact from './sections/Contact'
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>(0)

  // Init Lenis immediately (not gated behind intro)
  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisRef.current = instance
    setLenis(instance)

    instance.on('scroll', ScrollTrigger.update)

    function raf(time: number) {
      instance.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 800)

    const handleResize = () => {
      ScrollTrigger.refresh()
      instance.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(refreshTimer)
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = (target: string) => {
    lenisRef.current?.scrollTo(target, { duration: 1.5 })
  }

  return (
    <div className="relative">
      <CustomCursor />

      {/* Intro overlay — scroll-scrubbed frame sequence, then exits */}
      {!introComplete && (
        <Intro onComplete={() => setIntroComplete(true)} lenis={lenis} />
      )}

      {/* Main content — Hidden behind intro overlay until it exits */}
      <Navigation scrollTo={scrollTo} />

      <main className="relative">
        <Hero scrollTo={scrollTo} />
        <About />
        <Projects />
        <Services />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}