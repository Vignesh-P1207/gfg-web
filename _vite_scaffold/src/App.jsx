import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import ResourcesPage from './pages/ResourcesPage'
import CommunityPage from './pages/CommunityPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/events" element={<><Navbar solid /><EventsPage /></>} />
        <Route path="/resources" element={<><Navbar solid /><ResourcesPage /></>} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </BrowserRouter>
  )
}
