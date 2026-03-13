import { useState } from 'react'
import Footer from '../components/Footer'

const paths = [
  { icon: 'account_tree', color: 'bg-[#2f8e47]', title: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Graphs, DP — the complete interview prep roadmap.', weeks: 16, lessons: 64, level: 'Beginner → Pro', progress: 0 },
  { icon: 'web', color: 'bg-blue-600', title: 'Full-Stack Web Development', desc: 'HTML, CSS, JS, React, Node.js, databases, and deployment.', weeks: 12, lessons: 48, level: 'Intermediate', progress: 45 },
  { icon: 'smart_toy', color: 'bg-orange-500', title: 'AI/ML Fundamentals', desc: 'Python, NumPy, scikit-learn, TensorFlow and real-world ML projects.', weeks: 14, lessons: 56, level: 'Beginner', progress: 0 },
  { icon: 'palette', color: 'bg-purple-600', title: 'UI/UX Designer Path', desc: 'Figma, design systems, user research, and usability testing.', weeks: 8, lessons: 32, level: 'Beginner', progress: 0 },
  { icon: 'cloud', color: 'bg-red-500', title: 'AWS Cloud Solutions', desc: 'S3, EC2, Lambda, RDS, IAM — prep for Solutions Architect cert.', weeks: 10, lessons: 40, level: 'Intermediate', progress: 20 },
  { icon: 'phone_android', color: 'bg-cyan-600', title: 'Mobile Dev with Flutter', desc: 'Build cross-platform iOS & Android apps with Dart and Flutter.', weeks: 10, lessons: 40, level: 'Beginner', progress: 0 },
]

const recommended = [
  { icon: 'play_circle', iconColor: 'text-[#2f8e47]', title: 'Dynamic Programming Masterclass', meta: '45 min · Video' },
  { icon: 'article', iconColor: 'text-blue-500', title: 'System Design Interview: A Step-by-Step Guide', meta: '20 min · Article' },
  { icon: 'code', iconColor: 'text-orange-500', title: '50 Top LeetCode Problems Explained', meta: 'Practice Set · Interactive' },
  { icon: 'play_circle', iconColor: 'text-purple-500', title: 'React Hooks Deep Dive', meta: '60 min · Video' },
]

const studyGroups = [
  { title: 'DSA Daily Challenge Group', meta: '42 members · Active now' },
  { title: 'Web Dev Study Circle', meta: '28 members · Meets Thu 7PM' },
  { title: 'ML Research Reading Group', meta: '17 members · Meets Sat 10AM' },
  { title: 'Interview Prep Bootcamp', meta: '64 members · Daily 8PM' },
]

export default function ResourcesPage() {
  const [query, setQuery] = useState('')
  const filtered = paths.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.desc.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20">

      {/* Hero */}
      <section className="bg-[#032014] text-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7]">DevEdu Hub</p>
          <h1 className="serif-headline text-5xl md:text-7xl font-normal mt-4 mb-6">Learning Resources</h1>
          <p className="text-slate-300/80 text-lg max-w-xl mb-8">Curated paths, tutorials and tools to master modern technology.</p>
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 max-w-md">
            <span className="material-symbols-outlined text-white/60">search</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
              placeholder="Search resources, topics, or paths..."
            />
          </div>
        </div>
      </section>

      {/* Featured Path */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 bg-gradient-to-br from-[#2f8e47]/10 to-[#032014]/5 dark:from-[#2f8e47]/10 dark:to-[#032014]/40 border border-[#2f8e47]/15 rounded-3xl p-10">
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2f8e47] mb-3">Featured Path</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Master Modern <span className="text-[#2f8e47]">Web Development</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-base leading-relaxed">
              A comprehensive path from HTML basics to advanced React, Node.js, and cloud deployment. Curated by our technical leads.
            </p>
            <div className="flex gap-6 flex-wrap mb-8 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-[#2f8e47]">schedule</span> 12 Weeks</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-[#2f8e47]">menu_book</span> 48 Lessons</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base text-[#2f8e47]">people</span> 320 Enrolled</span>
            </div>
            <button className="rounded-full bg-[#2f8e47] text-white font-bold px-8 py-3 text-sm hover:bg-[#267a3c] transition-colors shadow-lg shadow-[#2f8e47]/20">
              Start Learning
            </button>
          </div>
          <div className="bg-white dark:bg-[#0d1a10] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl min-w-[180px]">
            <span className="material-symbols-outlined text-[#2f8e47] text-5xl">web</span>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-3 mb-4">Web Dev Path</p>
            <div className="relative w-20 h-20 mx-auto">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                <circle cx="40" cy="40" r="34" stroke="#2f8e47" strokeWidth="6" fill="none"
                  strokeDasharray="213" strokeDashoffset="66" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#2f8e47]">69%</span>
            </div>
          </div>
        </div>
      </section>

      {/* All Paths */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Curated <span className="text-[#2f8e47]">Learning Paths</span></h2>
        <div className="flex flex-col gap-4">
          {filtered.map(p => (
            <div key={p.title} className="flex items-center gap-5 p-5 bg-white dark:bg-[#0d1a10] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#2f8e47]/40 hover:translate-x-1 transition-all">
              <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-white text-2xl">{p.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{p.desc}</p>
                <div className="flex gap-4 flex-wrap mt-2 text-xs text-slate-400">
                  <span>{p.weeks} weeks</span>
                  <span>{p.lessons} lessons</span>
                  <span className="bg-[#2f8e47]/10 text-[#2f8e47] font-semibold px-2 py-0.5 rounded">{p.level}</span>
                </div>
                {p.progress > 0 && (
                  <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-48">
                    <div className="h-full bg-[#2f8e47] rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                )}
              </div>
              <button className="rounded-full bg-[#2f8e47] text-white text-xs font-bold px-4 py-1.5 hover:bg-[#267a3c] transition-colors whitespace-nowrap flex-shrink-0">
                {p.progress > 0 ? 'Continue' : 'Start'}
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-12">No paths found for "{query}"</p>
          )}
        </div>
      </section>

      {/* Recommended + Study Groups */}
      <section className="bg-[#2f8e47]/5 py-16 px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-[#2f8e47]">thumb_up</span> Recommended for You</h3>
            <div className="flex flex-col gap-3">
              {recommended.map(r => (
                <a key={r.title} href="#" className="flex items-center gap-4 p-4 bg-white dark:bg-[#0d1a10] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#2f8e47]/40 hover:translate-x-1 transition-all">
                  <span className={`material-symbols-outlined text-3xl ${r.iconColor}`}>{r.icon}</span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{r.title}</h4>
                    <span className="text-xs text-slate-400">{r.meta}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-[#2f8e47]">groups</span> Study Groups</h3>
            <div className="flex flex-col gap-3">
              {studyGroups.map(g => (
                <div key={g.title} className="flex items-center justify-between p-4 bg-white dark:bg-[#0d1a10] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[#2f8e47]/40 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{g.title}</h4>
                    <span className="text-xs text-slate-400">{g.meta}</span>
                  </div>
                  <button className="rounded-full bg-[#2f8e47] text-white text-xs font-bold px-4 py-1.5 hover:bg-[#267a3c] transition-colors ml-4 flex-shrink-0">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
