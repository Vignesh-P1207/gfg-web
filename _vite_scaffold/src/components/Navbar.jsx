import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 50)
      // Only show navbar if we are at the very top (scrollY = 0)
      setIsVisible(currentScrollY === 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = !solid && !scrolled

  const links = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/resources', label: 'Resources' },
    { to: '/community', label: 'Community' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
        } ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 dark:bg-[#0d1a10]/95 backdrop-blur-md shadow-sm border-b border-[#2f8e47]/10'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden p-1">
              <img src="/images/gfg-logo.png" alt="GFG Logo" className="h-full w-full object-contain" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isTransparent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              GFG Chapter
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'text-[#2f8e47] font-semibold'
                    : isTransparent
                    ? 'text-white hover:text-[#a3e6b7]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#2f8e47]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg ${isTransparent ? 'text-white/70' : 'text-slate-400'}`}>
                search
              </span>
              <input
                className={`h-10 w-56 rounded-lg border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f8e47]/40 ${
                  isTransparent
                    ? 'border-white/20 bg-white/10 text-white placeholder-white/60'
                    : 'border-slate-200 bg-white dark:bg-[#1a2e1e] dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400'
                }`}
                placeholder="Search resources..."
                type="text"
              />
            </div>
            <Link
              to="/community"
              className="rounded-lg bg-[#2f8e47] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2f8e47]/20 hover:bg-[#267a3c] transition-all"
            >
              Join Club
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`md:hidden p-2 ${isTransparent ? 'text-white' : 'text-slate-700 dark:text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0d1a10] border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col gap-3">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`py-2 text-sm font-medium ${pathname === to ? 'text-[#2f8e47] font-semibold' : 'text-slate-700 dark:text-slate-200'}`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/community"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-[#2f8e47] px-5 py-2.5 text-sm font-bold text-white text-center"
            >
              Join Club
            </Link>
          </div>
        )}
      </header>
    </>
  )
}
