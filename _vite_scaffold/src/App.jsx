import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import VideoOverlay from './components/VideoOverlay'
import ClickEffect from './components/ClickEffect'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import ResourcesPage from './pages/ResourcesPage'
import CommunityPage from './pages/CommunityPage'
import RoadmapPage from './pages/RoadmapPage'
import AuthPage from './pages/AuthPage'

const hasSeenOverlay = { current: false }

function HomeWithOverlay() {
  const [overlayDone, setOverlayDone] = useState(hasSeenOverlay.current)

  function handleComplete() {
    hasSeenOverlay.current = true
    setOverlayDone(true)
  }

  return (
    <>
      {!hasSeenOverlay.current && <VideoOverlay onComplete={handleComplete} />}
      <motion.div
        initial={{ opacity: overlayDone ? 1 : 0, scale: overlayDone ? 1 : 1.05, filter: overlayDone ? 'blur(0px)' : 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={overlayDone ? { duration: 0 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Navbar />
        <HomePage />
      </motion.div>
    </>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClickEffect />
        <Routes>
          <Route path="/" element={<HomeWithOverlay />} />
          <Route path="/events" element={<><Navbar solid /><EventsPage /></>} />
          <Route path="/resources" element={<><Navbar solid /><ResourcesPage /></>} />
          <Route path="/workshops" element={<><Navbar solid /><RoadmapPage /></>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/community" element={
            <ProtectedRoute><Navbar solid /><CommunityPage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

