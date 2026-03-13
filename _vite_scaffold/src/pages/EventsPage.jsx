import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const FILTERS = ['All', 'Workshop', 'Hackathon', 'Seminar']

const events = [
  { type: 'Workshop', color: 'bg-orange-500', icon: 'security', title: 'Advanced Web Pentesting', date: 'Dec 24, 2024', time: '10:00 AM', seats: 120, tags: ['Security', 'Web Dev'], gradient: 'from-slate-900 to-slate-800' },
  { type: 'Hackathon', color: 'bg-[#2f8e47]', icon: 'bolt', title: 'Code Sprint 2024', date: 'Jan 5–6, 2025', time: '9:00 AM', seats: 240, tags: ['$10k Prize', '48h'], gradient: 'from-[#032014] to-[#0d3b1e]', featured: true },
  { type: 'Seminar', color: 'bg-blue-600', icon: 'smart_toy', title: 'AI Evolution Seminar', date: 'Jan 15, 2025', time: '2:00 PM', seats: 80, tags: ['AI/ML', 'Research'], gradient: 'from-slate-900 to-blue-950' },
  { type: 'Workshop', color: 'bg-purple-600', icon: 'account_tree', title: 'DSA Mastery Workshop', date: 'Jan 22, 2025', time: '11:00 AM', seats: 60, tags: ['DSA', 'Placement'], gradient: 'from-purple-950 to-slate-900' },
  { type: 'Seminar', color: 'bg-blue-600', icon: 'cloud', title: 'Cloud & DevOps Bootcamp', date: 'Feb 1, 2025', time: '3:00 PM', seats: 90, tags: ['Cloud', 'DevOps'], gradient: 'from-slate-900 to-green-950' },
  { type: 'Hackathon', color: 'bg-orange-500', icon: 'developer_mode', title: 'Open Source Hackfest', date: 'Feb 14–15, 2025', time: '9:00 AM', seats: 150, tags: ['Open Source'], gradient: 'from-red-950 to-slate-900' },
]

const announcements = [
  { dot: 'bg-[#2f8e47]', date: 'Dec 10, 2024', title: 'Hackathon 2024: Registrations are Now Open!', body: 'The biggest event of the year is finally here. Join 500+ participants for 48 hours of building, learning, and competing for prizes worth $10k.' },
  { dot: 'bg-blue-500', date: 'Nov 28, 2024', title: 'New Mentors Joining the Chapter!', body: 'Our new mentors come from Google, Meta, and Microsoft to help you navigate your tech career and ace technical interviews.' },
  { dot: 'bg-orange-500', date: 'Nov 15, 2024', title: 'Website & Portal Redesign Launched', body: "We've revamped our club portal with a fresh UI, improved resources section, and a new community forum." },
]

export default function EventsPage() {
  const [active, setActive] = useState('All')

  const filtered = events.filter(e => active === 'All' || e.type === active)

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20">

      {/* Page Hero */}
      <section className="bg-[#032014] text-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">GFG Student Chapter</p>
          <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-6">Tech Events Hub</h1>
          <p className="text-slate-300/80 text-lg max-w-xl">Stay up-to-date with our upcoming workshops, hackathons, and seminars.</p>
          {/* Filter tabs */}
          <div className="flex gap-3 flex-wrap mt-10">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full px-5 py-2 text-sm font-semibold border transition-all ${
                  active === f
                    ? 'bg-[#2f8e47] border-[#2f8e47] text-white'
                    : 'border-white/20 text-white/70 hover:border-white/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2f8e47]">event</span> Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ev => (
            <div
              key={ev.title}
              className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-[#0d1a10] flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2f8e47]/10 ${ev.featured ? 'border-[#2f8e47]/40' : 'border-slate-200 dark:border-slate-800'}`}
            >
              {ev.featured && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md bg-[#2f8e47]/90 px-2 py-1 text-white text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">star</span> Featured
                </div>
              )}
              {/* Card header */}
              <div className={`bg-gradient-to-br ${ev.gradient} h-28 flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white/60 text-5xl">{ev.icon}</span>
              </div>
              {/* Badge */}
              <div className={`absolute top-3 left-3 ${ev.color} text-white text-xs font-bold px-2.5 py-1 rounded-md`}>{ev.type}</div>
              {/* Body */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex gap-4 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>{ev.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">schedule</span>{ev.time}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{ev.title}</h3>
                <div className="flex gap-2 flex-wrap">
                  {ev.tags.map(t => (
                    <span key={t} className="rounded-full bg-[#2f8e47]/10 text-[#2f8e47] dark:text-[#a3e6b7] text-xs font-semibold px-3 py-0.5 border border-[#2f8e47]/20">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">people</span>{ev.seats} seats left
                  </span>
                  <button className="rounded-full bg-[#2f8e47] text-white text-xs font-bold px-4 py-1.5 hover:bg-[#267a3c] transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="bg-[#2f8e47]/5 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2f8e47]">campaign</span> Latest Announcements
          </h2>
          <div className="flex flex-col gap-4 mb-10">
            {announcements.map(a => (
              <div key={a.title} className="flex gap-5 p-6 bg-white dark:bg-[#0d1a10] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#2f8e47]/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`} />
                <div className="flex-1">
                  <span className="text-xs text-slate-400 block mb-1">{a.date}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{a.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{a.body}</p>
                  <a href="#" className="mt-2 inline-block text-sm font-semibold text-[#2f8e47] hover:underline">Learn More →</a>
                </div>
              </div>
            ))}
          </div>
          {/* Suggest */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-7 rounded-2xl border border-[#2f8e47]/20 bg-[#2f8e47]/5">
            <span className="material-symbols-outlined text-4xl text-[#2f8e47]">lightbulb</span>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Have a great event idea?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Suggest a workshop, talk, or hackathon theme!</p>
            </div>
            <a href="mailto:gfgchapter@example.com" className="rounded-full bg-[#2f8e47] text-white font-bold px-5 py-2.5 text-sm hover:bg-[#267a3c] transition-colors whitespace-nowrap">
              Submit Idea
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
