import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CodeRunner from '../components/CodeRunner'
import { PROBLEMS } from '../data/problems'

const TOPICS = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP', 'Sorting', 'Stack/Queue', 'Math']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

const diffColor = { Easy: 'text-emerald-500', Medium: 'text-amber-500', Hard: 'text-red-500' }
const diffBg = { Easy: 'bg-emerald-500/10 border-emerald-500/20', Medium: 'bg-amber-500/10 border-amber-500/20', Hard: 'bg-red-500/10 border-red-500/20' }

export default function PracticePage() {
  const [activeTopic, setActiveTopic] = useState('All')
  const [activeDiff, setActiveDiff] = useState('All')
  const [expandedProblem, setExpandedProblem] = useState(null)
  const [solvedIds, setSolvedIds] = useState(new Set())
  const [search, setSearch] = useState('')

  const filtered = PROBLEMS.filter(p =>
    (activeTopic === 'All' || p.topic === activeTopic) &&
    (activeDiff === 'All' || p.difficulty === activeDiff) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  )

  const stats = {
    total: PROBLEMS.length,
    easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length,
    medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length,
    hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length,
    solved: solvedIds.size,
  }

  return (
    <div className="bg-[#f6f8f6] dark:bg-[#141e16] text-slate-900 dark:text-slate-100 pt-20 min-h-screen">
      
      {/* Hero */}
      <section className="bg-[#032014] text-white py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#a3e6b7] mb-2">DSA Practice Arena</p>
              <h1 className="serif-headline text-4xl md:text-6xl font-normal mb-4">Code. Solve. Master.</h1>
              <p className="text-slate-300/80 text-lg max-w-xl">Curated coding problems from top tech interviews. Filter by topic, difficulty, and company tags.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Problems</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.easy}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Easy</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{stats.medium}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Medium</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-bold text-red-400">{stats.hard}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Hard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Interactive Compiler Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117] rounded-2xl p-6 mb-8 border border-[#2f8e47]/30 shadow-lg shadow-[#2f8e47]/5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-2 left-4 text-[#2f8e47]/10 font-mono text-xs leading-5 select-none" style={{ whiteSpace: 'pre' }}>
{`function solve(nums) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i]))
      return [map.get(target - nums[i]), i];
    map.set(nums[i], i);
  }
}`}
            </div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#2f8e47]/20 flex items-center justify-center flex-shrink-0 border border-[#2f8e47]/30">
              <span className="material-symbols-outlined text-3xl text-[#2f8e47]">code_blocks</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg text-white mb-1">🚀 Interactive Code Runner — Now Live!</h3>
              <p className="text-sm text-slate-400">Write, run, and test your code in real-time with our built-in compiler. Supports JavaScript, Python, C++, and Java. Click any problem to start coding!</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <span className="px-3 py-1 rounded-full bg-[#2f8e47]/10 text-[#2f8e47] text-[10px] font-bold border border-[#2f8e47]/20">JavaScript</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">Python</span>
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold border border-orange-500/20">C++</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">Java</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 flex-1 max-w-md">
            <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            <input className="bg-transparent flex-1 text-sm outline-none placeholder-slate-400 text-slate-900 dark:text-white" placeholder="Search problems, tags..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {/* Difficulty */}
          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setActiveDiff(d)} className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-all ${activeDiff === d ? 'bg-[#2f8e47] border-[#2f8e47] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-[#2f8e47]/50'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Topic pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TOPICS.map(t => (
            <button key={t} onClick={() => setActiveTopic(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${activeTopic === t ? 'bg-[#032014] border-[#032014] text-white dark:bg-white dark:border-white dark:text-[#032014]' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#2f8e47]/50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white dark:bg-[#0d170e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 flex items-center gap-6">
          <div className="flex-1">
            <p className="text-sm font-bold mb-2">Your Progress: <span className="text-[#2f8e47]">{stats.solved}/{stats.total}</span> solved</p>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2f8e47] to-[#a3e6b7] rounded-full transition-all" style={{ width: `${(stats.solved / stats.total) * 100}%` }} />
            </div>
          </div>
          <Link to="/courses" className="rounded-full bg-[#2f8e47] text-white text-xs font-bold px-5 py-2 hover:bg-[#267a3c] transition-colors whitespace-nowrap">
            View Courses
          </Link>
        </div>

        {/* Problem List */}
        <div className="flex flex-col gap-3">
          {filtered.map(p => (
            <div key={p.id} className={`bg-white dark:bg-[#0d170e] border rounded-2xl overflow-hidden transition-all ${solvedIds.has(p.id) ? 'border-[#2f8e47]/40' : 'border-slate-200 dark:border-slate-800'} hover:shadow-lg`}>
              {/* Problem header */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpandedProblem(expandedProblem === p.id ? null : p.id)}
              >
                {/* Status */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSolvedIds(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n }) }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${solvedIds.has(p.id) ? 'bg-[#2f8e47] border-[#2f8e47] text-white' : 'border-slate-300 dark:border-slate-600 hover:border-[#2f8e47]'}`}
                >
                  {solvedIds.has(p.id) && <span className="material-symbols-outlined text-sm">check</span>}
                </button>

                {/* Number and Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-mono">#{p.id}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffBg[p.difficulty]} ${diffColor[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">{p.topic}</span>
                    {p.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] text-[#2f8e47] bg-[#2f8e47]/10 px-2 py-0.5 rounded font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">thumb_up</span>{p.likes}</span>
                  <span>{p.acceptance}%</span>
                </div>

                {/* Company tags */}
                <div className="hidden lg:flex gap-1">
                  {p.companies.slice(0, 2).map(c => (
                    <span key={c} className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                <span className="material-symbols-outlined text-slate-400 text-xl">{expandedProblem === p.id ? 'expand_less' : 'expand_more'}</span>
              </div>

              {/* Expanded view */}
              {expandedProblem === p.id && (
                <div className="border-t border-slate-100 dark:border-white/5 p-6 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Problem description */}
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3">Problem Description</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                      
                      <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Examples</h5>
                      {p.examples.map((ex, i) => (
                        <div key={i} className="bg-[#032014] rounded-xl p-4 mb-3 font-mono text-xs">
                          <p className="text-slate-400"><strong className="text-[#a3e6b7]">Input:</strong> {ex.input}</p>
                          <p className="text-slate-400 mt-1"><strong className="text-[#a3e6b7]">Output:</strong> {ex.output}</p>
                          {ex.explanation && <p className="text-slate-500 mt-1 italic">// {ex.explanation}</p>}
                        </div>
                      ))}

                      <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 mt-4">Constraints</h5>
                      <ul className="text-xs text-slate-500 space-y-1 mb-4">
                        {p.constraints.map((c, i) => <li key={i} className="flex items-start gap-2"><span className="text-[#2f8e47] mt-0.5">•</span>{c}</li>)}
                      </ul>

                      <div className="bg-[#2f8e47]/10 border border-[#2f8e47]/20 rounded-xl p-4">
                        <p className="text-xs font-bold text-[#2f8e47] mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">lightbulb</span> Hint</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{p.hint}</p>
                      </div>

                      {/* Full-screen solver link */}
                      <Link
                        to={`/practice/${p.id}`}
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#032014] text-[#a3e6b7] text-sm font-bold py-3 px-6 hover:bg-[#0a3a25] transition-all border border-[#2f8e47]/20 hover:border-[#2f8e47]/50 hover:shadow-lg hover:shadow-[#2f8e47]/10"
                      >
                        <span className="material-symbols-outlined text-lg">fullscreen</span>
                        Solve in Full Screen Mode
                      </Link>
                    </div>

                    {/* Right: Interactive Code editor */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">Interactive Compiler</h4>
                        <Link
                          to={`/practice/${p.id}`}
                          className="text-xs text-[#2f8e47] hover:underline flex items-center gap-1 font-bold"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Full Screen
                        </Link>
                      </div>
                      <CodeRunner problem={p} compact={true} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
              <p>No problems found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}
