import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface IntroProps {
  onComplete: () => void
}

export default function Intro({ onComplete }: IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const slashRef = useRef<HTMLDivElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const exitPlayedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setVideoReady(true)
      video.play().catch(() => {})
      // Deterministic exit: fire exactly at 4.2s after play starts
      setTimeout(() => {
        if (!exitPlayedRef.current) {
          video.pause()
          playExitAnimation()
        }
      }, 4200)
    }

    const handleError = () => {
      if (!exitPlayedRef.current) {
        setVideoReady(true)
        playExitAnimation()
      }
    }

    video.addEventListener('canplaythrough', handleCanPlay)
    video.addEventListener('error', handleError)
    video.load()

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const playExitAnimation = () => {
    if (exitPlayedRef.current) return
    exitPlayedRef.current = true

    const tl = gsap.timeline()

    // White flash — clean transition, no blue
    tl.to(slashRef.current, {
      opacity: 1,
      clipPath: 'polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)',
      duration: 0.4,
      ease: 'power2.inOut',
    })

    // Fade out entire intro on white
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        onComplete()
      },
    }, '-=0.1')
  }

  // Fallback timer in case video events don't fire at all
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!exitPlayedRef.current) {
        playExitAnimation()
      }
    }, 5500)
    return () => clearTimeout(fallbackTimer)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* Katana video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/katana-intro.mp4"
        muted
        playsInline
        preload="auto"
        style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.3s' }}
      />

      {/* White flash overlay — no blue, no screen blend */}
      <div
        ref={slashRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: '#ffffff',
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          opacity: 0,
        }}
      />

      {/* Loading indicator — neutral white, no cyan */}
      {!videoReady && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#000' }}>
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
