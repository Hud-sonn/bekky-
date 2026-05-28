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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setVideoReady(true)
      video.play().catch(() => {})
    }

    video.addEventListener('canplaythrough', handleCanPlay)
    video.load()

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [])

  useEffect(() => {
    if (!videoReady) return

    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.currentTime >= 4.2) {
        video.pause()
        playExitAnimation()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)

    const playExitAnimation = () => {
      const tl = gsap.timeline()

      // Flash white
      tl.to(containerRef.current, {
        backgroundColor: '#ffffff',
        duration: 0.15,
        ease: 'power2.in',
      })

      // Slash effect - diagonal wipe
      tl.to(slashRef.current, {
        clipPath: 'polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)',
        duration: 0.4,
        ease: 'power3.inOut',
      }, '-=0.05')

      // Cyan glow burst
      tl.to(slashRef.current, {
        boxShadow: '0 0 100px 50px rgba(0, 180, 216, 0.8)',
        duration: 0.2,
        ease: 'power2.out',
      }, '-=0.3')

      // Fade out entire intro
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onComplete()
        },
      }, '-=0.1')
    }

    // Fallback timer in case video events don't fire properly
    const fallbackTimer = setTimeout(() => {
      playExitAnimation()
    }, 5500)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      clearTimeout(fallbackTimer)
    }
  }, [videoReady, onComplete])

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

      {/* Slash transition overlay */}
      <div
        ref={slashRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #00B4D8 0%, #90E0EF 50%, #00B4D8 100%)',
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Loading indicator */}
      {!videoReady && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#000' }}>
          <div className="w-12 h-12 border-2 border-cyan-glow border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}