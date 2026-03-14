import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClickEffect() {
  const [clicks, setClicks] = useState([])

  useEffect(() => {
    const handleClick = (e) => {
      const newClick = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      }
      setClicks(prev => [...prev, newClick])
      
      // Cleanup the click element after animation
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== newClick.id))
      }, 1000)
    }

    // Capture phase so we get the event even if something calls stopPropagation
    document.addEventListener('mousedown', handleClick, { capture: true })
    return () => document.removeEventListener('mousedown', handleClick, { capture: true })
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            className="absolute rounded-full border-2 border-[#2f8e47]"
            style={{ 
              left: click.x, 
              top: click.y,
              // Center the circle on the mouse pointer exactly
              x: '-50%',
              y: '-50%'
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 60, height: 60, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
