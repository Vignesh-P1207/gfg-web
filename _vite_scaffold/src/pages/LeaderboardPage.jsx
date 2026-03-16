import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

// Data now fetched from the backend API

const recentActivity = [
  { id: 1, user: 'Aryan Tiwari', action: 'solved', problem: 'Trapping Rain Water', time: '2m ago' },
  { id: 2, user: 'Priya Mehta', action: 'reached streak', problem: '7 days', time: '15m ago' },
  { id: 3, user: 'Vignesh', action: 'solved QOTD', problem: 'Valid Parentheses', time: '1h ago' },
  { id: 4, user: 'Neha Sharma', action: 'registered for', problem: 'Code Sprint 2024', time: '3h ago' },
]

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('All-Time')
  const [users, setUsers] = useState([])
  const [qotd, setQotd] = useState(null)
  const [qotdTimeLeft, setQotdTimeLeft] = useState('')

  // Fetch real-time XP changes from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/leaderboard?filter=${filter}`)
        const data = await res.json()
        
        // Map backend data to UI expectations
        const mappedUsers = data.map((u, i) => ({
          id: u.id,
          name: u.username,
          initials: u.username.substring(0, 2).toUpperCase(),
          xp: u.xp,
          streak: u.streak,
          level: u.badge,
          rank: u.rank,
          rankChange: u.trend === 'up' ? 1 : u.trend === 'down' ? -1 : 0,
          me: u.username === 'vignesh', // Replace with real auth check
          problems: Math.floor(u.xp / 10), // mock stat
          trophy: i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
        }))
        setUsers(mappedUsers)
      } catch (err) {
        console.error("Failed to fetch leaderboard", err)
      }
    }

    fetchLeaderboard()
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [filter])

  // Fetch QOTD
  useEffect(() => {
    const fetchQOTD = async () => {
      try {
        const res = await fetch('http://localhost:5005/api/daily-question')
        const data = await res.json()
        setQotd(data)
      } catch (err) {
        console.error("Failed to fetch QOTD", err)
      }
    }
    fetchQOTD()
  }, [])

  // QOTD countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const diff = endOfDay - now
      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setQotdTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    updateCountdown()
    const int = setInterval(updateCountdown, 1000)
    return () => clearInterval(int)
  }, [])

  const top3 = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] min-h-screen text-slate-900 dark:text-slate-100 pt-20">
      <section className="bg-[#032014] text-white py-16 px-6 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[#2f8e47] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7] mb-2">Hall of Fame</p>
            <h1 className="serif-headline text-5xl md:text-7xl font-normal mb-6">Chapter Leaderboard</h1>
            <div className="flex justify-center gap-2 bg-[#163a23] p-1.5 rounded-full mx-auto w-max">
              {['Weekly', 'Monthly', 'All-Time'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === f ? 'bg-[#2f8e47] text-white shadow-lg shadow-[#032014]' : 'text-[#a3e6b7] hover:bg-white/5'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Podium (Top 3) */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-12 mt-10 md:mt-24 pb-8 h-[250px]">
            {/* Rank 2 (Left) */}
            {top3[1] && (
              <div className="flex flex-col items-center w-full md:w-48 transform translate-y-4 hover:-translate-y-2 transition-transform duration-300">
                <span className="text-3xl mb-2 animate-bounce flex items-center gap-1"><span className="text-2xl text-[#bdbdbd]">#2</span> 🥈</span>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-[0_0_20px_rgba(189,189,189,0.3)]">
                  {top3[1].initials}
                </div>
                <p className="font-bold text-lg">{top3[1].name}</p>
                <div className="text-[#a3e6b7] font-mono font-bold mt-1 bg-white/10 px-3 py-1 rounded-full text-sm">
                  {top3[1].xp.toLocaleString()} XP
                </div>
              </div>
            )}

            {/* Rank 1 (Center) */}
            {top3[0] && (
              <div className="flex flex-col items-center w-full md:w-56 z-10 hover:-translate-y-4 transition-transform duration-300">
                <span className="text-4xl mb-2 animate-bounce flex items-center gap-1 shadow-[#ffc107]/50 drop-shadow-xl"><span className="text-3xl text-[#ffc107]">#1</span> 🏆</span>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-[0_0_30px_rgba(255,193,7,0.4)] border-2 border-yellow-300">
                  {top3[0].initials}
                </div>
                <p className="font-bold text-xl text-yellow-50">{top3[0].name}</p>
                <div className="text-yellow-400 font-mono font-bold mt-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-1.5 rounded-full text-base shadow-inner">
                  {top3[0].xp.toLocaleString()} XP
                </div>
              </div>
            )}

            {/* Rank 3 (Right) */}
            {top3[2] && (
              <div className="flex flex-col items-center w-full md:w-48 transform translate-y-8 hover:-translate-y-2 transition-transform duration-300">
                <span className="text-3xl mb-2 animate-bounce flex items-center gap-1"><span className="text-2xl text-[#cd7f32]">#3</span> 🥉</span>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-[0_0_20px_rgba(205,127,50,0.3)]">
                  {top3[2].initials}
                </div>
                <p className="font-bold text-lg">{top3[2].name}</p>
                <div className="text-[#a3e6b7] font-mono font-bold mt-1 bg-white/10 px-3 py-1 rounded-full text-sm">
                  {top3[2].xp.toLocaleString()} XP
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Leaderboard Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-[#2f8e47]/5">
              <div className="grid grid-cols-12 gap-4 p-5 bg-[#2f8e47]/5 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                <div className="col-span-6 md:col-span-5">Member</div>
                <div className="hidden md:block col-span-2 text-center">Problems</div>
                <div className="hidden md:block col-span-2 text-center">Streak</div>
                <div className="col-span-4 md:col-span-2 text-right pr-4">XP</div>
              </div>
              <div className="flex flex-col relative">
                {rest.map((u) => (
                  <div key={u.id} className={`grid grid-cols-12 gap-4 p-5 items-center border-b border-slate-100 dark:border-white/5 last:border-0 transition-all duration-500 ${u.me ? 'bg-[#2f8e47]/10 border-l-4 border-l-[#2f8e47]' : 'hover:bg-slate-50 dark:hover:bg-white/3 border-l-4 border-l-transparent'}`}>
                    <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
                      <span className="font-bold text-slate-400">{u.rank}</span>
                      {u.rankChange > 0 ? (
                        <span className="text-[10px] text-emerald-500 flex items-center font-bold mt-1"><span className="material-symbols-outlined text-[10px]">arrow_drop_up</span>{u.rankChange}</span>
                      ) : u.rankChange < 0 ? (
                        <span className="text-[10px] text-red-500 flex items-center font-bold mt-1"><span className="material-symbols-outlined text-[10px]">arrow_drop_down</span>{Math.abs(u.rankChange)}</span>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold mt-1">-</span>
                      )}
                    </div>
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2f8e47] to-[#032014] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-inner">
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-2 text-sm">
                          {u.name}
                          {u.me && <span className="rounded bg-[#2f8e47] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">You</span>}
                        </p>
                        <p className="text-[11px] text-[#2f8e47] font-semibold">{u.level}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex col-span-2 justify-center items-center gap-1 text-slate-600 dark:text-slate-400 text-sm font-medium">
                      <span className="material-symbols-outlined text-sm text-slate-400">code_blocks</span> {u.problems}
                    </div>
                    <div className="hidden md:flex col-span-2 justify-center items-center gap-1 text-slate-600 dark:text-slate-400 text-sm font-medium">
                      <span className="material-symbols-outlined text-sm text-orange-500">local_fire_department</span> {u.streak}
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right pr-4 font-mono font-bold text-[#2f8e47]">
                      {u.xp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="flex flex-col gap-6">
            
            {/* DSA Question of the Day Widget */}
            <div className="bg-gradient-to-br from-[#0d170e] to-[#162719] border border-[#2f8e47]/30 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-[#2f8e47]/10">
              <div className="absolute -top-10 -right-10 text-9xl material-symbols-outlined text-white/5 rotate-12 pointer-events-none">star</div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="bg-[#2f8e47]/20 text-[#a3e6b7] text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[#2f8e47]/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">timer</span> {qotdTimeLeft}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">local_fire_department</span> +50 XP
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Question of the Day</h3>
              {qotd ? (
                <>
                  <p className="text-sm font-bold text-slate-300 mb-1 relative z-10">{qotd.title}</p>
                  <div className="flex gap-2 mb-4 relative z-10">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${qotd.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : qotd.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {qotd.difficulty}
                    </span>
                    {qotd.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={qotd.link} target="_blank" rel="noreferrer" className="w-full text-center block rounded-full bg-[#2f8e47] text-white font-bold px-4 py-3 text-sm hover:bg-[#267a3c] transition-colors relative z-10 shadow-lg shadow-[#2f8e47]/20">
                    Solve on LeetCode
                  </a>
                </>
              ) : (
                <div className="flex flex-col items-center py-4 relative z-10">
                  <span className="material-symbols-outlined text-[#2f8e47] animate-spin mb-2">progress_activity</span>
                  <p className="text-xs text-slate-400">Loading today's challenge...</p>
                </div>
              )}
            </div>

            {/* Streak & Achievements */}
            <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2f8e47]">local_fire_department</span> Your Streak
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-[#2f8e47]">7</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Day Streak!</p>
                  <p className="text-xs text-slate-500">Solve 1 more problem today to keep it going.</p>
                </div>
              </div>
              
              {/* Heatmap simulation */}
              <div className="flex gap-1 mb-6">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-full aspect-square rounded-md ${i < 7 ? (i === 6 ? 'bg-[#2f8e47]/30 border-2 border-[#2f8e47] animate-pulse' : 'bg-[#2f8e47]') : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                    <span className="text-[10px] font-bold text-slate-400">{day}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Badges Unlocked</h3>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 hover:scale-110 transition-transform cursor-help" title="7-Day Streak">
                    <span className="material-symbols-outlined">local_fire_department</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 hover:scale-110 transition-transform cursor-help" title="First Problem Solved">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 hover:scale-110 transition-transform cursor-help" title="Attended 10 Events">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 cursor-help" title="Solve 50 Problems">
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[#2f8e47] animate-pulse">sensors</span> Live Activity
              </h3>
              <div className="flex flex-col gap-4">
                {recentActivity.map(act => (
                  <div key={act.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-[10px]">
                      {act.user.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">{act.user}</strong> {act.action} <span className="font-medium text-[#2f8e47]">{act.problem}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
