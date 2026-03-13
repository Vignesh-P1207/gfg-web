import { useState } from 'react'
import { Link } from 'react-router-dom'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/community' },
  { icon: 'group', label: 'Community', to: '#' },
  { icon: 'calendar_month', label: 'Events', to: '/events' },
  { icon: 'menu_book', label: 'Courses', to: '/resources' },
  { icon: 'leaderboard', label: 'Leaderboard', to: '#' },
  { icon: 'settings', label: 'Settings', to: '#' },
]

const leaderboard = [
  { rank: '🥇', initials: 'AT', name: 'Aryan Tiwari', xp: 3240, pct: 100, color: '#ffc107' },
  { rank: '🥈', initials: 'PM', name: 'Priya Mehta', xp: 2980, pct: 92, color: '#bdbdbd' },
  { rank: '🥉', initials: 'RK', name: 'Rahul Kumar', xp: 2610, pct: 80, color: '#cd7f32' },
  { rank: '4', initials: 'NS', name: 'Neha Sharma', xp: 2310, pct: 71, color: '#2f8e47' },
  { rank: '7', initials: 'SJ', name: 'Sandeep Jain', xp: 1840, pct: 57, color: '#2f8e47', me: true },
]

const blogs = [
  { gradient: 'from-[#032014] to-[#1a7a3c]', icon: 'bolt', tag: 'Announcement', title: 'Hackathon 2024: Registrations are Now Open!', body: 'The biggest event of the year is finally here. Join 500+ participants for 48 hours...', link: '/events' },
  { gradient: 'from-slate-900 to-slate-800', icon: 'auto_awesome', tag: 'Tutorial', title: 'Mastering Dynamic Programming: A Visual Guide', body: 'Struggling with Memoization? We break down DP problems into intuitive visual steps...', link: '/resources' },
  { gradient: 'from-[#1a0d2e] to-[#3b1a5e]', icon: 'groups', tag: 'News', title: 'Meet the New Batch of Club Mentors', body: 'Mentors from Google, Meta, and Microsoft join to help you navigate your career...', link: '#' },
]

export default function CommunityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#f6f8f6] dark:bg-[#0d1a10] text-slate-900 dark:text-slate-100">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0d170e] border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Link to="/" className="flex items-center gap-3 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f8e47] text-white">
            <span className="material-symbols-outlined text-base">terminal</span>
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">GFG Chapter</span>
        </Link>

        {/* User badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#2f8e47]/10 border border-[#2f8e47]/20 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2f8e47] to-[#032014] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            SJ
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Sandeep Jain</h4>
            <p className="text-xs font-medium text-[#2f8e47] truncate">Expert Explorer · Lv.12</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                label === 'Dashboard'
                  ? 'bg-[#2f8e47]/10 text-[#2f8e47] font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-slate-400 mt-auto text-center">© 2024 GeeksforGeeks Student Club</p>
      </aside>

      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0d170e]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-slate-600 dark:text-slate-300" onClick={() => setSidebarOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-bold text-slate-900 dark:text-white text-lg">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2f8e47] rounded-full" />
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2f8e47] to-[#032014] flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              SJ
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1">

          {/* Welcome banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#032014] to-[#0d3b1e] rounded-2xl p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2f8e47]/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Welcome back, Sandeep! 👋</h2>
                <p className="text-slate-300/80 text-sm mb-5">
                  You've reached Level 12 Explorer status. Earn 250 more XP to unlock Level 13 and get the "Algorithm Guru" title!
                </p>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>Level 12</span>
                    <span>250 XP to Level 13 · "Algorithm Guru"</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden w-full max-w-xs">
                    <div className="h-full bg-gradient-to-r from-[#2f8e47] to-[#a3e6b7] rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl px-6 py-4 flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-yellow-400">military_tech</span>
                <span className="text-xs font-bold text-white/80">Expert Explorer</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'code', color: 'text-[#2f8e47]', value: '248', label: 'Problems Solved' },
              { icon: 'calendar_month', color: 'text-blue-500', value: '12', label: 'Events Attended' },
              { icon: 'stars', color: 'text-yellow-500', value: '1,840', label: 'Total XP Earned' },
              { icon: 'emoji_events', color: 'text-purple-500', value: '#7', label: 'Chapter Rank' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-[#2f8e47]/30 transition-colors">
                <span className={`material-symbols-outlined text-3xl ${s.color}`}>{s.icon}</span>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard + Blogs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Leaderboard */}
            <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2f8e47]">leaderboard</span> Top Contributors
              </h3>
              <div className="flex flex-col gap-3">
                {leaderboard.map(({ rank, initials, name, xp, pct, color, me }) => (
                  <div key={name} className={`flex items-center gap-3 p-3 rounded-xl ${me ? 'bg-[#2f8e47]/8 border border-[#2f8e47]/20' : 'hover:bg-slate-50 dark:hover:bg-white/3'}`}>
                    <span className="text-lg w-7 text-center">{rank}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold flex-shrink-0 text-slate-700 dark:text-slate-200">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1">
                        {name}
                        {me && <span className="rounded bg-[#2f8e47] text-white text-[10px] font-bold px-1.5 py-0.5 ml-1">You</span>}
                      </p>
                      <p className="text-xs text-slate-400">{xp.toLocaleString()} XP</p>
                    </div>
                    <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blogs */}
            <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2f8e47]">article</span> Club Updates &amp; Blogs
              </h3>
              <div className="flex flex-col gap-4">
                {blogs.map(b => (
                  <Link key={b.title} to={b.link} className="flex gap-4 group">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center flex-shrink-0`}>
                      <span className="material-symbols-outlined text-white/80 text-xl">{b.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#2f8e47]">{b.tag}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5 group-hover:text-[#2f8e47] transition-colors line-clamp-1">{b.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{b.body}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
