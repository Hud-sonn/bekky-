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

  const [allLoaded, setAllLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const img = imagesRef.current[index]
    if (!canvas || !ctx || !img || !img.complete) return
    currentFrameRef.current = index
    drawCoverFit(ctx, img, canvas.width, canvas.height)
  }, [])

  // ── Preload + progressive draw ──
  useEffect(() => {
    let cancelled = false
    let frames: HTMLImageElement[] = []

    async function loadFrames() {
      const res = await fetch('/frames/katana-intro/manifest.json')
      const manifest: Manifest = await res.json()
      if (cancelled) return

      const total = manifest.frameCount
      let loadedCount = 0

      // Setup canvas before any frames arrive
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      // Pre-allocate array
      frames = new Array(total)
      imagesRef.current = frames

      for (let i = 0; i < total; i++) {
        const frameNum = i + 1
        const img = new Image()
        frames[i] = img
        img.src = buildFramePath(manifest.basePath, manifest.filenamePattern, frameNum)

        img.onload = () => {
          if (cancelled) return
          loadedCount++
          // Throttle progress updates — one re-render per 5 frames instead of 147
          if (loadedCount % 5 === 0 || loadedCount === total) {
            setLoadProgress(Math.round((loadedCount / total) * 100))
          }

          // Draw first loaded frame to canvas immediately
          if (loadedCount === 1) {
            drawFrame(0)
          }

          if (loadedCount === total) {
            setAllLoaded(true)
          }
        }

        img.onerror = () => {
          if (cancelled) return
          loadedCount++
          if (loadedCount % 5 === 0 || loadedCount === total) {
            setLoadProgress(Math.round((loadedCount / total) * 100))
          }
          if (loadedCount === total) setAllLoaded(true)
        }
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

  // ── Scroll-scrub via Lenis ──
  useEffect(() => {
    if (!allLoaded || !lenis) return

    // Reset scroll to start — user may have scrolled during loading
    lenis.scrollTo(0, { immediate: true, lock: true })

    const totalFrames = imagesRef.current.length
    const pxPerFrame = 4
    const scrollThreshold = totalFrames * pxPerFrame

    const unsubscribe = lenis.on('scroll', (e: { scroll: number }) => {
      if (exitPlayedRef.current) return

      const progress = Math.min(1, e.scroll / scrollThreshold)
      const idx = Math.min(totalFrames - 1, Math.floor(progress * totalFrames))
      drawFrame(idx)

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(0, 1 - progress * 6))
      }

      if (progress >= 1) {
        playExit()
      }
    })

    return () => unsubscribe()
  }, [allLoaded, lenis, drawFrame, playExit])

  return (
    <div
      id="intro-overlay"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* Canvas always visible — draws frames progressively as they load */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
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

      {/* Loading overlay — sits on top of canvas, fades when complete */}
      {!allLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-4 z-10">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white/80 text-sm font-medium tracking-wide">
            {loadProgress}%
          </span>
        </div>
      )}

      {/* Scroll to begin — appears when loading completes */}
      {allLoaded && (
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