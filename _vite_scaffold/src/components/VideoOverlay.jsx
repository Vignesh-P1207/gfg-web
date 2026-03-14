import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * VideoOverlay — mandatory loading screen with audio.
 * Auto-plays muted (browser policy), shows an unmute button.
 * One tap enables audio instantly while the video keeps playing.
 */
export default function VideoOverlay({ onComplete }) {
  const videoRef = useRef(null)
  const [phase, setPhase] = useState('playing')   // playing → exiting → done
  const [isMuted, setIsMuted] = useState(true)

  // ── Auto-play on mount (muted first to guarantee playback) ──
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.play().catch(() => {
      // If even muted autoplay fails, skip to reveal
      setPhase('exiting')
    })
  }, [])

  // ── Unmute handler — click is a user gesture, so browser allows it ──
  const handleUnmute = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setIsMuted(false)
  }

  // ── Lock body scroll while overlay is visible ──
  useEffect(() => {
    if (phase === 'done') {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [phase])

  // ── Video ended → start zoom-in dissolve exit ──
  const handleVideoEnd = () => setPhase('exiting')

  // ── Animation finished → remove overlay & reveal page ──
  const handleExitComplete = () => {
    setPhase('done')
    onComplete?.()
  }

  if (phase === 'done') return null

  const showOverlay = phase === 'playing'

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {showOverlay && (
        <motion.div
          key="video-overlay"
          className="fixed inset-0 z-9999 bg-black overflow-hidden"
          style={{ transformOrigin: 'center center' }}
          exit={{
            scale: 5,
            opacity: 0,
            filter: 'blur(40px) brightness(2) contrast(0.5)',
          }}
          transition={{
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
            opacity: { duration: 1.2, delay: 0.3 },
            filter: { duration: 1.4, ease: 'easeIn' },
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
          >
            <source src="/0314.mp4" type="video/mp4" />
          </video>

          {/* Unmute button — prominent, bottom-center */}
          {isMuted && (
            <motion.button
              onClick={handleUnmute}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20
                         flex items-center gap-2.5 px-6 py-3
                         rounded-full bg-white/15 backdrop-blur-md
                         border border-white/25 cursor-pointer
                         hover:bg-white/25 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="material-symbols-outlined text-white text-xl">
                volume_off
              </span>
              <span className="text-white text-sm font-medium tracking-wide">
                Tap to unmute
              </span>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
