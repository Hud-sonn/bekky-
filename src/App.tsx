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
  const [showContent, setShowContent] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (introComplete) {
      setShowContent(true)
    }
  }, [introComplete])

  useEffect(() => {
    if (!showContent) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 500)

    return () => {
      clearTimeout(refreshTimer)
      lenis.destroy()
    }
  }, [showContent])

  const scrollTo = (target: string) => {
    lenisRef.current?.scrollTo(target, { duration: 1.5 })
  }

  return (
    <div className="relative">
      <CustomCursor />

      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}

      {showContent && (
        <>
          <Navigation scrollTo={scrollTo} />
          <main className="relative">
            <Hero scrollTo={scrollTo} />
            <About />
            <Projects />
            <Services />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
