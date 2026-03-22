import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CodeRunner from '../components/CodeRunner'
import { PROBLEMS } from '../data/problems'

const diffColor = { Easy: 'text-emerald-500', Medium: 'text-amber-500', Hard: 'text-red-500' }
const diffBg = { Easy: 'bg-emerald-500/10 border-emerald-500/20', Medium: 'bg-amber-500/10 border-amber-500/20', Hard: 'bg-red-500/10 border-red-500/20' }

export default function ProblemSolverPage() {
  const { id } = useParams()
  const problem = PROBLEMS.find(p => p.id === parseInt(id))
  const [activeDescTab, setActiveDescTab] = useState('description')
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [splitPosition, setSplitPosition] = useState(45) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Timer
  useEffect(() => {
    if (!timerRunning) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [timerRunning])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Drag for split pane
  const handleMouseDown = () => setIsDragging(true)
  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e) => {
      const pct = (e.clientX / window.innerWidth) * 100
      setSplitPosition(Math.max(25, Math.min(75, pct)))
    }
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Navigate to next/prev problem
  const currentIndex = PROBLEMS.findIndex(p => p.id === parseInt(id))
  const prevProblem = currentIndex > 0 ? PROBLEMS[currentIndex - 1] : null
  const nextProblem = currentIndex < PROBLEMS.length - 1 ? PROBLEMS[currentIndex + 1] : null

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600 block mb-4">search_off</span>
          <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
          <p className="text-slate-400 mb-6">The problem you're looking for doesn't exist.</p>
          <Link to="/practice" className="rounded-full bg-[#2f8e47] text-white font-bold px-6 py-3 hover:bg-[#267a3c] transition-colors">
            ← Back to Practice
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-white overflow-hidden" style={{ userSelect: isDragging ? 'none' : 'auto' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/practice" className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Problems
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            {prevProblem && (
              <Link to={`/practice/${prevProblem.id}`} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </Link>
            )}
            <span className="text-sm font-bold text-white">
              <span className="text-slate-500 font-mono">#{problem.id}</span> {problem.title}
            </span>
            {nextProblem && (
              <Link to={`/practice/${nextProblem.id}`} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </Link>
            )}
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${diffBg[problem.difficulty]} ${diffColor[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-[#0d1117] rounded-lg px-3 py-1.5 border border-slate-700/50">
            <span className="material-symbols-outlined text-sm text-[#2f8e47]">timer</span>
            <span className="text-sm font-mono text-slate-300">{formatTime(timer)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">{timerRunning ? 'pause' : 'play_arrow'}</span>
            </button>
            <button
              onClick={() => { setTimer(0); setTimerRunning(true) }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-slate-500 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-xl">{isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div
          className="flex-shrink-0 overflow-y-auto border-r border-slate-700/50"
          style={{ width: `${splitPosition}%` }}
        >
          {/* Tab Headers */}
          <div className="sticky top-0 z-10 flex items-center gap-1 px-4 py-2 bg-[#161b22] border-b border-slate-700/50">
            {[
              { id: 'description', icon: 'description', label: 'Description' },
              { id: 'hints', icon: 'lightbulb', label: 'Hints' },
              { id: 'solutions', icon: 'code', label: 'Editorial' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDescTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDescTab === tab.id
                    ? 'bg-[#2f8e47]/20 text-[#2f8e47]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeDescTab === 'description' && (
              <div className="flex flex-col gap-6">
                {/* Title & Meta */}
                <div>
                  <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${diffBg[problem.difficulty]} ${diffColor[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">{problem.topic}</span>
                    {problem.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium text-[#2f8e47] bg-[#2f8e47]/10 px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-yellow-500">thumb_up</span>
                      {problem.likes}
                    </span>
                    <span>Acceptance: {problem.acceptance}%</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">{problem.desc}</p>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Examples</h3>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-[#161b22] rounded-xl p-4 mb-3 border border-slate-700/50">
                      <p className="text-xs font-bold text-slate-300 mb-2">Example {i + 1}:</p>
                      <div className="font-mono text-xs space-y-1">
                        <p><span className="text-[#a3e6b7] font-bold">Input: </span><span className="text-slate-300">{ex.input}</span></p>
                        <p><span className="text-[#a3e6b7] font-bold">Output: </span><span className="text-slate-300">{ex.output}</span></p>
                        {ex.explanation && <p className="text-slate-500 italic mt-2">💡 {ex.explanation}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Constraints</h3>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#2f8e47] mt-0.5 flex-shrink-0">•</span>
                        <code className="bg-[#161b22] px-2 py-0.5 rounded text-slate-300 border border-slate-700/30">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Tags */}
                <div className="pt-4 border-t border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Frequently Asked At</p>
                  <div className="flex gap-2 flex-wrap">
                    {problem.companies.map(c => (
                      <span key={c} className="text-xs font-bold bg-[#161b22] text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#2f8e47]">domain</span>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDescTab === 'hints' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-white">Hints & Approach</h3>
                
                {/* Hint 1 - Always visible */}
                <div className="bg-[#161b22] rounded-xl border border-slate-700/50 overflow-hidden">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#2f8e47]/20 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#2f8e47] text-lg">lightbulb</span>
                    </span>
                    <span className="text-sm font-bold text-white flex-1 text-left">Hint 1: Key Intuition</span>
                    <span className="material-symbols-outlined text-slate-400 text-lg">
                      {showHint ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                  {showHint && (
                    <div className="px-4 pb-4 border-t border-slate-700/30 pt-3">
                      <p className="text-sm text-slate-300 leading-relaxed">{problem.hint}</p>
                    </div>
                  )}
                </div>

                {/* Approach */}
                <div className="bg-[#2f8e47]/10 border border-[#2f8e47]/20 rounded-xl p-5">
                  <h4 className="font-bold text-sm text-[#2f8e47] mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">psychology</span>
                    Think About
                  </h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#2f8e47] mt-0.5">1.</span>
                      What data structure would give you O(1) lookup time?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2f8e47] mt-0.5">2.</span>
                      Can you solve this in a single pass through the data?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2f8e47] mt-0.5">3.</span>
                      What are the edge cases to consider?
                    </li>
                  </ul>
                </div>

                {/* Related Topics */}
                <div>
                  <h4 className="font-bold text-sm text-white mb-2">Related Topics</h4>
                  <div className="flex gap-2 flex-wrap">
                    {problem.tags.map(t => (
                      <span key={t} className="text-xs font-bold bg-[#161b22] text-[#2f8e47] px-3 py-1.5 rounded-full border border-[#2f8e47]/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDescTab === 'solutions' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg text-white">Editorial</h3>
                <div className="bg-[#161b22] rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#2f8e47]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#2f8e47]">auto_awesome</span>
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">Approach: {problem.tags[0]}</p>
                      <p className="text-[10px] text-slate-400">Optimal Solution</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed space-y-3">
                    <p><strong className="text-[#a3e6b7]">Intuition:</strong> {problem.hint}</p>
                    <p><strong className="text-[#a3e6b7]">Approach:</strong> Use the {problem.tags[0]?.toLowerCase()} technique to efficiently solve this problem.</p>
                    <p><strong className="text-[#a3e6b7]">Complexity:</strong></p>
                    <ul className="text-xs space-y-1 ml-4">
                      <li>• <strong>Time:</strong> O(n) — Single pass through the data</li>
                      <li>• <strong>Space:</strong> O(n) — Additional data structure</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic text-center">💡 Try solving the problem yourself before reading the editorial!</p>
              </div>
            )}
          </div>
        </div>

        {/* Drag Handle */}
        <div
          className="w-1.5 cursor-col-resize hover:bg-[#2f8e47]/50 active:bg-[#2f8e47] transition-colors flex-shrink-0 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 rounded-full bg-slate-700 group-hover:bg-[#2f8e47]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-xs text-slate-400">drag_indicator</span>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 overflow-y-auto p-4">
          <CodeRunner problem={problem} />
        </div>
      </div>
    </div>
  )
}
