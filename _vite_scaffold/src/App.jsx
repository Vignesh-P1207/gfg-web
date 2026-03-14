import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import VideoOverlay from './components/VideoOverlay'
import ClickEffect from './components/ClickEffect'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import ResourcesPage from './pages/ResourcesPage'
import CommunityPage from './pages/CommunityPage'

function HomeWithOverlay() {
  const [overlayDone, setOverlayDone] = useState(false)

  return (
    <>
      <VideoOverlay onComplete={() => setOverlayDone(true)} />
      <motion.div
        initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        animate={overlayDone
          ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
          : { opacity: 0, scale: 1.05, filter: 'blur(10px)' }
        }
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Navbar />
        <HomePage />
      </motion.div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ClickEffect />
      <Routes>
        <Route path="/" element={<HomeWithOverlay />} />
        <Route path="/events" element={<><Navbar solid /><EventsPage /></>} />
        <Route path="/resources" element={<><Navbar solid /><ResourcesPage /></>} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </BrowserRouter>
  )
}

