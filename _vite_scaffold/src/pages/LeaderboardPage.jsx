import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Aryan Tiwari', initials: 'AT', xp: 3240, problems: 412, events: 15, level: 'Elite', color: '#ffc107', trophy: '🏆' },
  { rank: 2, name: 'Priya Mehta', initials: 'PM', xp: 2980, problems: 385, events: 12, level: 'Elite', color: '#bdbdbd', trophy: '🥈' },
  { rank: 3, name: 'Rahul Kumar', initials: 'RK', xp: 2610, problems: 342, events: 10, level: 'Advanced', color: '#cd7f32', trophy: '🥉' },
  { rank: 4, name: 'Neha Sharma', initials: 'NS', xp: 2310, problems: 298, events: 8, level: 'Advanced', color: '#2f8e47' },
  { rank: 5, name: 'Dhruv Gupta', initials: 'DG', xp: 2150, problems: 276, events: 9, level: 'Intermediate', color: '#2f8e47' },
  { rank: 6, name: 'Ananya Singh', initials: 'AS', xp: 1980, problems: 254, events: 7, level: 'Intermediate', color: '#2f8e47' },
  { rank: 7, name: 'Vignesh', initials: 'V', xp: 1840, problems: 248, events: 12, level: 'Expert', color: '#2f8e47', me: true },
  { rank: 8, name: 'Kabir Saxena', initials: 'KS', xp: 1720, problems: 221, events: 6, level: 'Explorer', color: '#2f8e47' },
  { rank: 9, name: 'Ishaan Malhotra', initials: 'IM', xp: 1560, problems: 198, events: 5, level: 'Explorer', color: '#2f8e47' },
  { rank: 10, name: 'Gayatri Rao', initials: 'GR', xp: 1450, problems: 185, events: 4, level: 'Explorer', color: '#2f8e47' },
]

export default function LeaderboardPage() {
  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] min-h-screen text-slate-900 dark:text-slate-100 pt-20">
      <section className="bg-[#032014] text-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">Hall of Fame</p>
          <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-6">Chapter Leaderboard</h1>
          <p className="text-slate-300/80 text-lg max-w-xl">Celebrating the top contributors and most active members of our student chapter.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-6 gap-4 p-6 bg-[#2f8e47]/5 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-2">Member</div>
            <div className="col-span-1 text-center">XP</div>
            <div className="col-span-1 text-center">Problems</div>
            <div className="col-span-1 text-center">Level</div>
          </div>
          <div className="flex flex-col">
            {LEADERBOARD_DATA.map((u) => (
              <div key={u.name} className={`grid grid-cols-6 gap-4 p-6 items-center border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors ${u.me ? 'bg-[#2f8e47]/10' : 'hover:bg-slate-50 dark:hover:bg-white/3'}`}>
                <div className="col-span-1 text-center flex flex-col items-center">
                  <span className="text-lg font-bold">{u.rank}</span>
                  {u.trophy && <span className="text-xl mt-1">{u.trophy}</span>}
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2f8e47] to-[#032014] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                      {u.name}
                      {u.me && <span className="rounded bg-[#2f8e47] text-white text-[10px] font-bold px-1.5 py-0.5">You</span>}
                    </p>
                    <p className="text-xs text-slate-500">{u.events} events attended</p>
                  </div>
                </div>
                <div className="col-span-1 text-center font-bold text-[#2f8e47]">
                  {u.xp.toLocaleString()}
                </div>
                <div className="col-span-1 text-center text-slate-600 dark:text-slate-400">
                  {u.problems}
                </div>
                <div className="col-span-1 text-center">
                  <span className="rounded-full bg-[#2f8e47]/10 text-[#2f8e47] text-[10px] font-bold px-3 py-1 uppercase tracking-tight">
                    {u.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 p-8 rounded-3xl bg-[#032014] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Want to climb the ranks?</h3>
            <p className="text-slate-300/80">Participate in more events, solve coding challenges, and contribute to club projects to earn XP.</p>
          </div>
          <Link to="/events" className="rounded-full bg-[#2f8e47] text-white font-bold px-8 py-4 hover:bg-[#267a3c] transition-colors whitespace-nowrap shadow-lg shadow-[#2f8e47]/20">
            View Upcoming Events
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
