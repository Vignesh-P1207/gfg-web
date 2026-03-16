import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const FILTERS = ['All', 'Workshop', 'Hackathon', 'Seminar']

const mockEvents = [
  { id: 1, type: 'Workshop', color: 'bg-orange-500', icon: 'security', title: 'Advanced Web Pentesting', date: 'Dec 24, 2024', time: '10:00 AM', seats: 120, tags: ['Security', 'Web Dev'], gradient: 'from-slate-900 to-slate-800' },
  { id: 2, type: 'Hackathon', color: 'bg-[#2f8e47]', icon: 'bolt', title: 'Code Sprint 2024', date: 'Jan 5-6, 2025', time: '9:00 AM', seats: 240, tags: ['$10k Prize', '48h'], gradient: 'from-[#032014] to-[#0d3b1e]', featured: true },
  { id: 3, type: 'Seminar', color: 'bg-blue-600', icon: 'smart_toy', title: 'AI Evolution Seminar', date: 'Jan 15, 2025', time: '2:00 PM', seats: 80, tags: ['AI/ML', 'Research'], gradient: 'from-slate-900 to-blue-950' },
  { id: 4, type: 'Workshop', color: 'bg-purple-600', icon: 'account_tree', title: 'DSA Mastery Workshop', date: 'Jan 22, 2025', time: '11:00 AM', seats: 60, tags: ['DSA', 'Placement'], gradient: 'from-purple-950 to-slate-900' },
  { id: 5, type: 'Seminar', color: 'bg-blue-600', icon: 'cloud', title: 'Cloud & DevOps Bootcamp', date: 'Feb 1, 2025', time: '3:00 PM', seats: 90, tags: ['Cloud', 'DevOps'], gradient: 'from-slate-900 to-green-950' },
  { id: 6, type: 'Hackathon', color: 'bg-orange-500', icon: 'developer_mode', title: 'Open Source Hackfest', date: 'Feb 14-15, 2025', time: '9:00 AM', seats: 150, tags: ['Open Source'], gradient: 'from-red-950 to-slate-900' },
  { id: 7, type: 'Workshop', color: 'bg-pink-600', icon: 'design_services', title: 'Figma for Devs', date: 'Mar 5, 2025', time: '4:00 PM', seats: 50, tags: ['Design', 'UI/UX'], gradient: 'from-pink-950 to-slate-900' },
  { id: 8, type: 'Seminar', color: 'bg-emerald-600', icon: 'currency_bitcoin', title: 'Web3 & Blockchain 101', date: 'Mar 12, 2025', time: '2:00 PM', seats: 100, tags: ['Web3', 'Crypto'], gradient: 'from-emerald-950 to-slate-900' },
]

const pastEvents = [
  { id: 101, title: 'Freshers Intro to Tech', date: 'Oct 15, 2024', attendees: 345, img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80' },
  { id: 102, title: 'App Dev with React Native', date: 'Nov 8, 2024', attendees: 120, img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80' },
  { id: 103, title: 'Git & GitHub Deep Dive', date: 'Nov 22, 2024', attendees: 210, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80' },
]

const announcements = [
  { dot: 'bg-[#2f8e47]', date: 'Dec 10, 2024', title: 'Hackathon 2024: Registrations are Now Open!', body: 'The biggest event of the year is finally here. Join 500+ participants for 48 hours of building, learning, and competing for prizes worth $10k.' },
  { dot: 'bg-blue-500', date: 'Nov 28, 2024', title: 'New Mentors Joining the Chapter!', body: 'Our new mentors come from Google, Meta, and Microsoft to help you navigate your tech career and ace technical interviews.' },
]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState('grid') // grid or calendar
  const [registerModal, setRegisterModal] = useState(null)
  const [createModal, setCreateModal] = useState(false)
  const [registeredEvents, setRegisteredEvents] = useState(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [now, setNow] = useState(new Date())

  // Timer simulation
  useEffect(() => {
    const int = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(int)
  }, [])

  const filtered = mockEvents.filter(e => activeTab === 'All' || e.type === activeTab)

  const handleRegister = (e) => {
    e.preventDefault()
    setRegisteredEvents(prev => new Set(prev).add(registerModal.id))
    setRegisterModal(null)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleCreateEvent = (e) => {
    e.preventDefault()
    setCreateModal(false)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20 relative">
      
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-3 h-3 rounded-sm animate-[fall_3s_ease-in-out_forwards]"
              style={{
                backgroundColor: ['#2f8e47', '#ffc107', '#3b82f6', '#ec4899', '#f97316'][Math.floor(Math.random()*5)],
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="bg-[#032014] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2f8e47]/20 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">GFG Student Chapter</p>
            <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-6">Tech Events Hub</h1>
            <p className="text-slate-300/80 text-lg max-w-xl">Stay up-to-date with our upcoming workshops, hackathons, and seminars. Connect, learn, and grow.</p>
          </div>
          <button 
            onClick={() => setCreateModal(true)}
            className="rounded-full bg-white text-[#032014] font-bold px-8 py-4 hover:bg-[#a3e6b7] transition-colors shadow-[0_0_30px_rgba(47,142,71,0.5)] flex items-center gap-2 flex-shrink-0"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Host an Event
          </button>
        </div>
        
        {/* Controls */}
        <div className="mx-auto max-w-7xl mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap bg-white/5 p-1.5 rounded-full border border-white/10">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveTab(f)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeTab === f ? 'bg-[#2f8e47] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex bg-white/5 border border-white/10 rounded-full overflow-hidden p-1">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${viewMode === 'grid' ? 'bg-[#2f8e47] text-white' : 'text-slate-400 hover:text-white'}`}>
              <span className="material-symbols-outlined text-[18px]">grid_view</span> Grid
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${viewMode === 'calendar' ? 'bg-[#2f8e47] text-white' : 'text-slate-400 hover:text-white'}`}>
              <span className="material-symbols-outlined text-[18px]">calendar_month</span> Calendar
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Left Column: Events List */}
          <div className="xl:col-span-3">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-[#2f8e47]">event_upcoming</span> Upcoming Schedule
            </h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(ev => (
                  <div key={ev.id} className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-[#0d170e] flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#2f8e47]/10 ${registeredEvents.has(ev.id) ? 'border-[#2f8e47] shadow-lg shadow-[#2f8e47]/10' : ev.featured ? 'border-[#2f8e47]/40 drop-shadow-md' : 'border-slate-200 dark:border-slate-800'}`}>
                    
                    {/* Header Image/Gradient */}
                    <div className={`bg-gradient-to-br ${ev.gradient} h-32 flex items-center justify-center relative overflow-hidden`}>
                      <span className="material-symbols-outlined text-white/20 text-7xl font-light transform -rotate-12 group-hover:scale-110 transition-transform duration-500 absolute right-4 bottom-[-10px]">{ev.icon}</span>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <div className={`${ev.color} text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm`}>{ev.type}</div>
                        {ev.featured && <div className="bg-[#ffc107] text-[#032014] text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">star</span> Featured</div>}
                      </div>
                      
                      {/* Countdown Overlay (Simulation) */}
                      {!registeredEvents.has(ev.id) && (
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs font-mono font-bold px-2 py-1 rounded flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          Opens in 2d 14h
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col gap-3 flex-1 relative">
                      {/* Registered checkmark */}
                      {registeredEvents.has(ev.id) && (
                        <div className="absolute -top-6 right-4 w-12 h-12 bg-white dark:bg-[#0d170e] rounded-full flex items-center justify-center shadow-lg border-2 border-[#2f8e47] z-10">
                          <span className="material-symbols-outlined text-2xl text-[#2f8e47] font-bold">check</span>
                        </div>
                      )}

                      <div className="flex gap-4 flex-wrap mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-sm text-[#2f8e47]">calendar_today</span>{ev.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-sm text-[#2f8e47]">schedule</span>{ev.time}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{ev.title}</h3>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {ev.tags.map(t => (
                          <span key={t} className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-1 uppercase tracking-tight">{t}</span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                          <span className="material-symbols-outlined text-[14px]">groups</span> {ev.seats} Seats
                        </span>
                        {registeredEvents.has(ev.id) ? (
                          <button className="rounded-full bg-slate-100 dark:bg-slate-800 text-[#2f8e47] font-bold px-5 py-2 text-sm flex items-center gap-1 cursor-default">
                            Registered
                          </button>
                        ) : (
                          <button 
                            onClick={() => setRegisterModal(ev)}
                            className="rounded-full bg-[#2f8e47] text-white font-bold px-6 py-2 text-sm hover:bg-[#267a3c] transition-colors shadow-md shadow-[#2f8e47]/20"
                          >
                            RSVP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Calendar View Mockup */
              <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">January 2025</h3>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="bg-slate-50 dark:bg-[#141e16] p-2 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">{d}</div>
                  ))}
                  {Array.from({length: 31}).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#0d170e] min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${i+1===15 ? 'bg-[#2f8e47] text-white' : 'text-slate-500 group-hover:text-[#2f8e47]'}`}>{i+1}</span>
                      {i+1 === 5 && <div className="mt-1 bg-[#2f8e47] text-white text-[9px] font-bold p-1 rounded truncate cursor-pointer" onClick={() => setRegisterModal(mockEvents[1])}>Code Sprint</div>}
                      {i+1 === 15 && <div className="mt-1 bg-blue-600 text-white text-[9px] font-bold p-1 rounded truncate cursor-pointer" onClick={() => setRegisterModal(mockEvents[2])}>AI Seminar</div>}
                      {i+1 === 22 && <div className="mt-1 bg-purple-600 text-white text-[9px] font-bold p-1 rounded truncate cursor-pointer" onClick={() => setRegisterModal(mockEvents[3])}>DSA Workshop</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Gallery */}
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-slate-400">photo_library</span> Past Events Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pastEvents.map(p => (
                  <div key={p.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-5">
                      <h3 className="font-bold text-white text-lg mb-1">{p.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-xs font-medium">{p.date}</span>
                        <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">group</span> {p.attendees}
                        </span>
                      </div>
                    </div>
                    {/* Hover overlay with 'View Album' */}
                    <div className="absolute inset-0 bg-[#2f8e47]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold tracking-widest uppercase text-sm border-2 border-white px-6 py-2 rounded-full">View Album</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* My Registrations Widget */}
            <div className="bg-[#2f8e47]/10 border border-[#2f8e47]/20 rounded-3xl p-6">
              <h3 className="font-bold text-[#2f8e47] dark:text-[#a3e6b7] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">confirmation_number</span> My Registrations
              </h3>
              {registeredEvents.size === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-[#2f8e47]/30 rounded-2xl">
                  <span className="material-symbols-outlined text-[#2f8e47]/40 text-4xl mb-2">event_busy</span>
                  <p className="text-sm text-[#2f8e47]/70 font-medium">No active registrations.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {Array.from(registeredEvents).map(id => {
                    const ev = mockEvents.find(e => e.id === id)
                    if(!ev) return null
                    return (
                      <div key={id} className="bg-white dark:bg-[#0d170e] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${ev.color} flex items-center justify-center text-white flex-shrink-0`}>
                          <span className="material-symbols-outlined text-[20px]">{ev.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{ev.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{ev.date} · {ev.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Announcements */}
            <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2f8e47]">campaign</span> Announcements
              </h3>
              <div className="flex flex-col gap-5">
                {announcements.map((a, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`} />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 leading-snug">{a.title}</h4>
                      <p className="text-xs text-slate-500 mb-2 leading-relaxed">{a.body}</p>
                      <span className="text-[10px] font-bold text-[#2f8e47] uppercase tracking-wider">{a.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      {registerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${registerModal.gradient} text-white relative`}>
              <button 
                onClick={() => setRegisterModal(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <span className={`inline-block ${registerModal.color} text-[10px] uppercase font-bold px-2.5 py-1 rounded-md mb-3`}>{registerModal.type}</span>
              <h2 className="text-2xl font-bold mb-1">{registerModal.title}</h2>
              <p className="text-white/70 text-sm flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">event</span> {registerModal.date}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {registerModal.time}</span>
              </p>
            </div>
            
            {/* Modal Body: Form */}
            <form onSubmit={handleRegister} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">First Name</label>
                  <input required className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Last Name</label>
                  <input required className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input required type="email" className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" placeholder="john.doe@example.com" />
              </div>
              {registerModal.type === 'Hackathon' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Team Username (Optional)</label>
                  <input className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" placeholder="@team-alpha" />
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setRegisterModal(null)} className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-4 py-3 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-[2] rounded-xl bg-[#2f8e47] text-white font-bold px-4 py-3 text-sm hover:bg-[#267a3c] transition-colors shadow-lg shadow-[#2f8e47]/20 flex items-center justify-center gap-2">
                  Confirm RSVP <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-[#0d170e] z-10">
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="material-symbols-outlined text-[#2f8e47]">add_circle</span> Host an Event</h2>
              <button onClick={() => setCreateModal(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                  <input required className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" placeholder="e.g. React Workshop" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Type</label>
                  <select className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white appearance-none">
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Hackathon</option>
                    <option>Networking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
                  <input required type="datetime-local" className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Capacity (Seats)</label>
                  <input required type="number" min="10" className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white" placeholder="e.g. 50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea required rows="4" className="w-full bg-slate-50 dark:bg-[#141e16] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2f8e47] transition-colors dark:text-white resize-none" placeholder="What is this event about?"></textarea>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setCreateModal(false)} className="rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold px-6 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-[#032014] text-white font-bold px-8 py-3 text-sm hover:bg-[#a3e6b7] hover:text-[#032014] transition-colors flex items-center gap-2">
                  Submit Event Proposal <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add keyframes for confetti */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

    </div>
  )
}
