import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import type Lenis from 'lenis'

interface Manifest {
  frameCount: number
  basePath: string
  filenamePattern: string
  width: number
  height: number
}

interface IntroProps {
  onComplete: () => void
  lenis: Lenis | null
}

function buildFramePath(basePath: string, pattern: string, index: number): string {
  const name = pattern.replace('%04d', String(index).padStart(4, '0'))
  return `${basePath}${name}`
}

function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
) {
  const imgAspect = img.naturalWidth / img.naturalHeight
  const canvasAspect = canvasW / canvasH

  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

  if (imgAspect > canvasAspect) {
    sw = img.naturalHeight * canvasAspect
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = img.naturalWidth / canvasAspect
    sy = (img.naturalHeight - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH)
}

export default function Intro({ onComplete, lenis }: IntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const exitPlayedRef = useRef(false)
  const currentFrameRef = useRef(0)

  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const img = imagesRef.current[index]
    if (!canvas || !ctx || !img || !img.complete) return

    currentFrameRef.current = index
    drawCoverFit(ctx, img, canvas.width, canvas.height)
  }, [])

  // ── Preload frames (1-indexed files: frame_0001.jpg → frame_0147.jpg) ──
  useEffect(() => {
    let cancelled = false

    async function loadFrames() {
      const res = await fetch('/frames/katana-intro/manifest.json')
      const manifest: Manifest = await res.json()
      if (cancelled) return

      const total = manifest.frameCount
      let loadedCount = 0
      const images: HTMLImageElement[] = []

      await new Promise<void>((resolve) => {
        for (let i = 0; i < total; i++) {
          const frameNum = i + 1 // files are 1-indexed
          const img = new Image()
          img.src = buildFramePath(manifest.basePath, manifest.filenamePattern, frameNum)
          img.onload = () => {
            loadedCount++
            if (!cancelled) setLoadProgress(Math.round((loadedCount / total) * 100))
            if (loadedCount === total) resolve()
          }
          img.onerror = () => {
            loadedCount++
            if (loadedCount === total) resolve()
          }
          images.push(img)
        }
      })

      if (cancelled) return
      imagesRef.current = images
      setLoaded(true)

      // Draw first frame
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        drawFrame(0)
      }
    }

    loadFrames()
    return () => { cancelled = true }
  }, [drawFrame])

  // ── Resize ──
  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(currentFrameRef.current)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawFrame])

  // ── Exit animation ──
  const playExit = useCallback(() => {
    if (exitPlayedRef.current) return
    exitPlayedRef.current = true

    const overlay = document.getElementById('intro-overlay')
    const flash = document.getElementById('intro-flash')

    // Scroll back to top so Hero is visible when overlay disappears
    lenis?.scrollTo(0, { immediate: true, lock: true })

    const tl = gsap.timeline()
    tl.to(flash, {
      opacity: 1,
      clipPath: 'polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)',
      duration: 0.4,
      ease: 'power2.inOut',
    })
    tl.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => onComplete(),
    }, '-=0.1')
  }, [onComplete, lenis])

  // ── Scroll-scrub via Lenis scroll progress ──
  // The main content (Hero, About, etc.) provides the scroll room.
  // We map the first `scrollThreshold` px of scroll to the frame sequence.
  useEffect(() => {
    if (!loaded || !lenis) return

    const totalFrames = imagesRef.current.length
    const pxPerFrame = 4
    const scrollThreshold = totalFrames * pxPerFrame // ~588px for 147 frames (about 1 screen)

    const unsubscribe = lenis.on('scroll', (e: { scroll: number }) => {
      if (exitPlayedRef.current) return

      const progress = Math.min(1, e.scroll / scrollThreshold)
      const idx = Math.min(totalFrames - 1, Math.floor(progress * totalFrames))
      drawFrame(idx)

      // Fade scroll hint
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(0, 1 - progress * 6))
      }

      // Trigger exit when past threshold
      if (progress >= 1) {
        playExit()
      }
    })

    return () => unsubscribe()
  }, [loaded, lenis, drawFrame, playExit])

  return (
    <div
      id="intro-overlay"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: loaded ? 'block' : 'none' }}
      />

      {/* White flash */}
      <div
        id="intro-flash"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: '#ffffff',
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          opacity: 0,
        }}
      />

      {/* Loading */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4 z-10">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white/60 text-sm font-medium tracking-wide">
            {loadProgress < 100 ? `${loadProgress}%` : 'Loading…'}
          </span>
        </div>
      )}

      {/* Scroll-to-begin prompt */}
      {loaded && (
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
        >
          <span className="text-white/70 text-xs font-medium tracking-[0.2em] uppercase">
            Scroll to begin
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-white/50 animate-bounce"
          >
            <path
              d="M10 4v12m0 0l-4-4m4 4l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
