import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Guidelines', to: '#' },
  { label: 'Join as Mentor', to: '#' },
  { label: 'Past Events', to: '/events' },
  { label: 'Contact Us', to: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#2f8e47]/10 bg-white dark:bg-[#0d1a10] py-12">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm overflow-hidden p-[2px]">
              <img src="/images/gfg-logo.png" alt="GFG Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#2f8e47]">GFG Student Chapter</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-8">
            {footerLinks.map(({ label, to }) => (
              <Link key={label} to={to} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#2f8e47] transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-slate-400">
            © 2024 GFG Student Chapter. All rights reserved. Powered by GeeksforGeeks.
          </p>
        </div>
      </div>
    </footer>
  )
}
