import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  { q: "Time Complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(1)"], correct: 1 },
  { q: "Space Complexity of Merge Sort?", options: ["O(1)", "O(log n)", "O(n)"], correct: 2 },
  { q: "Data structure for BFS?", options: ["Stack", "Array", "Queue"], correct: 2 },
  { q: "Which sort is NOT stable?", options: ["Merge", "Insertion", "Quick"], correct: 2 },
  { q: "Worst-case for standard QuickSort?", options: ["O(n log n)", "O(n²)", "O(n)"], correct: 1 },
  { q: "Access time of Array element?", options: ["O(1)", "O(n)", "O(log n)"], correct: 0 },
  { q: "Data structure for DFS?", options: ["Queue", "Hash Map", "Stack"], correct: 2 },
  { q: "Finding cycle in Linked List?", options: ["Dijkstra's", "Floyd's", "Kruskal's"], correct: 1 },
  { q: "Best case of Bubble Sort?", options: ["O(n²)", "O(n log n)", "O(n)"], correct: 2 },
  { q: "Which is a Min-Heap property?", options: ["Parent ≥ Children", "Parent ≤ Children", "Parent = Children"], correct: 1 },
  { q: "Inorder traversal visits nodes in?", options: ["Pre-order", "Sorted order", "Level order"], correct: 1 },
  { q: "Hash table average lookup?", options: ["O(n)", "O(log n)", "O(1)"], correct: 2 },
  { q: "Stack follows which principle?", options: ["FIFO", "LIFO", "FILO"], correct: 1 },
  { q: "Dijkstra's algorithm finds?", options: ["MST", "Shortest path", "Topological order"], correct: 1 },
  { q: "Which traversal uses a Queue?", options: ["DFS", "Inorder", "BFS"], correct: 2 },
  { q: "Time complexity of Heap Sort?", options: ["O(n²)", "O(n log n)", "O(n)"], correct: 1 },
  { q: "A complete binary tree with n nodes has height?", options: ["O(n)", "O(log n)", "O(√n)"], correct: 1 },
  { q: "Which data structure is used in recursion?", options: ["Queue", "Stack", "Heap"], correct: 1 },
  { q: "Kruskal's algorithm is used for?", options: ["Shortest path", "MST", "Cycle detection"], correct: 1 },
  { q: "Time complexity of inserting into a BST (avg)?", options: ["O(1)", "O(n)", "O(log n)"], correct: 2 },
]

// ── Audio Engine ──────────────────────────────────────────────────────────────
function createAudioEngine() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  const ctx = new AudioContext()

  // Engine drone: layered oscillators
  const masterGain = ctx.createGain()
  masterGain.gain.value = 0.18
  masterGain.connect(ctx.destination)

  const osc1 = ctx.createOscillator()
  osc1.type = 'sawtooth'
  osc1.frequency.value = 55
  const osc2 = ctx.createOscillator()
  osc2.type = 'square'
  osc2.frequency.value = 110
  const osc3 = ctx.createOscillator()
  osc3.type = 'sawtooth'
  osc3.frequency.value = 82

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 400
  filter.Q.value = 2

  osc1.connect(filter); osc2.connect(filter); osc3.connect(filter)
  filter.connect(masterGain)
  osc1.start(); osc2.start(); osc3.start()

  // Rhythmic pulse (simulates road bumps)
  let pulseInterval = null
  function startPulse(bpm = 120) {
    stopPulse()
    const interval = (60 / bpm) * 1000
    pulseInterval = setInterval(() => {
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.25, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      g.connect(ctx.destination)
      const kick = ctx.createOscillator()
      kick.type = 'sine'
      kick.frequency.setValueAtTime(120, ctx.currentTime)
      kick.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08)
      kick.connect(g)
      kick.start()
      kick.stop(ctx.currentTime + 0.1)
    }, interval)
  }
  function stopPulse() { if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null } }

  function setSpeed(speed) {
    // Pitch engine with speed
    const base = 55 + speed * 8
    osc1.frequency.setTargetAtTime(base, ctx.currentTime, 0.3)
    osc2.frequency.setTargetAtTime(base * 2, ctx.currentTime, 0.3)
    osc3.frequency.setTargetAtTime(base * 1.5, ctx.currentTime, 0.3)
    filter.frequency.setTargetAtTime(300 + speed * 40, ctx.currentTime, 0.3)
    startPulse(80 + speed * 6)
  }

  function stop() {
    stopPulse()
    try { osc1.stop(); osc2.stop(); osc3.stop() } catch {}
    masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
  }

  return { setSpeed, stop, ctx }
}

function playCrashSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const bufferSize = ctx.sampleRate * 0.6
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 4
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.4)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    noise.connect(filter); osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    noise.start(); osc.start(); osc.stop(ctx.currentTime + 0.4)
  } catch (e) {}
}

function playCorrectSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.08 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * 0.08)
      osc.stop(ctx.currentTime + i * 0.08 + 0.25)
    })
  } catch (e) {}
}

// ── Confetti Particle ─────────────────────────────────────────────────────────
function ConfettiParticle({ x, y, color, angle, speed, size }) {
  const style = {
    position: 'fixed',
    left: x,
    top: y,
    width: size,
    height: size * 0.5,
    backgroundColor: color,
    borderRadius: '2px',
    pointerEvents: 'none',
    zIndex: 9999,
    animation: `confettiFall 1.2s ease-out forwards`,
    transform: `rotate(${angle}deg)`,
    '--dx': `${(Math.random() - 0.5) * 200}px`,
    '--dy': `${-(80 + Math.random() * 160)}px`,
    '--rot': `${angle + (Math.random() - 0.5) * 720}deg`,
  }
  return <div style={style} />
}

function ConfettiBurst({ origin }) {
  const colors = ['#2f8e47', '#a3e6b7', '#fbbf24', '#f87171', '#60a5fa', '#e879f9', '#fff']
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: origin.x + (Math.random() - 0.5) * 40,
    y: origin.y + (Math.random() - 0.5) * 20,
    color: colors[i % colors.length],
    angle: Math.random() * 360,
    speed: 2 + Math.random() * 4,
    size: 6 + Math.random() * 8,
  }))
  return (
    <>
      {particles.map(p => <ConfettiParticle key={p.id} {...p} />)}
    </>
  )
}

// ── Speed Boost Flash ─────────────────────────────────────────────────────────
function SpeedBoostFlash({ streak }) {
  if (streak < 2) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] flex items-center justify-center">
      <div className="animate-[speedFlash_0.6s_ease-out_forwards] text-center">
        <div className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]"
          style={{ animation: 'speedFlash 0.7s ease-out forwards' }}>
          🔥 x{streak} STREAK!
        </div>
        <div className="text-lg font-bold text-white mt-1">SPEED BOOST!</div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DSARacerPage() {
  const [gameState, setGameState] = useState('START') // START | PLAYING | CRASHED | SUCCESS
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(1.5)
  const [carLane, setCarLane] = useState(1)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [obstacleY, setObstacleY] = useState(-50)
  const [qPool, setQPool] = useState([])
  const [streak, setStreak] = useState(0)          // consecutive correct answers
  const [showStreak, setShowStreak] = useState(false)
  const [confettiBursts, setConfettiBursts] = useState([])
  const [musicOn, setMusicOn] = useState(true)

  const requestRef   = useRef()
  const obstacleYRef = useRef(-50)
  const carLaneRef   = useRef(1)
  const stateRef     = useRef('START')
  const speedRef     = useRef(1.5)
  const streakRef    = useRef(0)
  const audioRef     = useRef(null)
  const answeredRef  = useRef(false) // prevent double-trigger per obstacle pass

  // ── Shuffle helper (Fisher-Yates) ──
  function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // ── Start Game ──
  const startGame = () => {
    // Stop old audio
    if (audioRef.current) { try { audioRef.current.stop() } catch {} }
    audioRef.current = null

    const shuffled = shuffle(QUESTIONS)
    setQPool(shuffled)
    setCurrentQIndex(0)
    setScore(0)
    setSpeed(1.0)
    speedRef.current = 1.0
    setCarLane(1)
    carLaneRef.current = 1
    obstacleYRef.current = -50
    stateRef.current = 'PLAYING'
    streakRef.current = 0
    setStreak(0)
    setShowStreak(false)
    setConfettiBursts([])
    answeredRef.current = false
    setGameState('PLAYING')

    // Start music
    if (musicOn) {
      const engine = createAudioEngine()
      if (engine) {
        audioRef.current = engine
        engine.setSpeed(1.0)
      }
    }
  }

  // ── Stop music on unmount ──
  useEffect(() => {
    return () => { if (audioRef.current) { try { audioRef.current.stop() } catch {} } }
  }, [])

  // ── Keyboard controls ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stateRef.current !== 'PLAYING') return
      if (e.key === 'ArrowLeft') {
        setCarLane(prev => { const n = Math.max(0, prev - 1); carLaneRef.current = n; return n })
      } else if (e.key === 'ArrowRight') {
        setCarLane(prev => { const n = Math.min(2, prev + 1); carLaneRef.current = n; return n })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── Confetti trigger ──
  const triggerConfetti = useCallback(() => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight * 0.55
    const id = Date.now()
    setConfettiBursts(prev => [...prev, { id, origin: { x: cx, y: cy } }])
    setTimeout(() => setConfettiBursts(prev => prev.filter(b => b.id !== id)), 1400)
  }, [])

  // ── Game Loop ──
  const update = useCallback(() => {
    if (stateRef.current !== 'PLAYING') return

    obstacleYRef.current += speedRef.current / 5
    setObstacleY(obstacleYRef.current)

    // Collision zone: 78–82%
    if (obstacleYRef.current > 78 && obstacleYRef.current < 82 && !answeredRef.current) {
      answeredRef.current = true
      const currentQ = qPool[currentQIndex]
      if (carLaneRef.current !== currentQ.correct) {
        stateRef.current = 'CRASHED'
        setGameState('CRASHED')
        playCrashSound()
        if (audioRef.current) { try { audioRef.current.stop() } catch {} }
        return
      }
    }

    // Passed obstacle
    if (obstacleYRef.current > 105) {
      const currentQ = qPool[currentQIndex]
      const wasCorrect = carLaneRef.current === currentQ.correct

      if (wasCorrect) {
        // Correct answer passed — award points + streak
        playCorrectSound()
        triggerConfetti()

        const newStreak = streakRef.current + 1
        streakRef.current = newStreak
        setStreak(newStreak)

        // Speed boost: +0.15 per correct, extra +0.2 every 3 streak, capped at 5
        const boost = 0.15 + (newStreak % 3 === 0 ? 0.2 : 0)
        const newSpeed = Math.min(speedRef.current + boost, 5)
        speedRef.current = newSpeed
        setSpeed(newSpeed)
        if (audioRef.current) audioRef.current.setSpeed(newSpeed)

        if (newStreak >= 2) {
          setShowStreak(true)
          setTimeout(() => setShowStreak(false), 900)
        }

        setScore(s => s + 10 + (newStreak - 1) * 5) // bonus for streak
      }

      obstacleYRef.current = -50
      answeredRef.current = false

      const nextIndex = currentQIndex + 1
      if (nextIndex < qPool.length) {
        setCurrentQIndex(nextIndex)
      } else {
        stateRef.current = 'SUCCESS'
        setGameState('SUCCESS')
        if (audioRef.current) { try { audioRef.current.stop() } catch {} }
        return
      }
    }

    requestRef.current = requestAnimationFrame(update)
  }, [currentQIndex, qPool, triggerConfetti])

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(update)
    }
    return () => cancelAnimationFrame(requestRef.current)
  }, [gameState, update])

  const currentQ = qPool[currentQIndex]

  // Road scroll speed tied to game speed
  const roadAnimDuration = gameState === 'PLAYING' ? `${Math.max(0.15, 0.6 / (speedRef.current / 3))}s` : '1s'

  return (
    <div className="bg-[#032014] min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden font-mono">

      {/* Confetti bursts */}
      {confettiBursts.map(b => <ConfettiBurst key={b.id} origin={b.origin} />)}

      {/* Speed streak flash */}
      {showStreak && <SpeedBoostFlash streak={streak} />}

      {/* Scrolling road bg */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 50%)',
          backgroundSize: '100% 40px',
          animation: gameState === 'PLAYING' ? `scrollRoad ${roadAnimDuration} linear infinite` : 'none',
        }}
      />

      {/* Top-left nav */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <Link to="/" className="text-[#a3e6b7] hover:text-white flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined">arrow_back</span> Exit
        </Link>
        {/* Music toggle */}
        <button
          onClick={() => {
            setMusicOn(m => {
              if (m && audioRef.current) { try { audioRef.current.stop() } catch {}; audioRef.current = null }
              return !m
            })
          }}
          className="text-slate-400 hover:text-white transition-colors"
          title={musicOn ? 'Mute music' : 'Enable music'}
        >
          <span className="material-symbols-outlined text-xl">{musicOn ? 'volume_up' : 'volume_off'}</span>
        </button>
      </div>

      {/* Score + streak HUD */}
      <div className="absolute top-6 right-6 z-20 text-right">
        <p className="text-[#a3e6b7] text-xs uppercase tracking-widest mb-0.5">Score</p>
        <p className="text-4xl font-bold">{score}</p>
        {streak >= 2 && (
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-yellow-400 text-sm font-bold">🔥 {streak} streak</span>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-1 font-mono">
          {gameState === 'PLAYING' ? `${(speedRef.current).toFixed(1)}x speed` : ''}
        </p>
      </div>

      {/* Main Game Area */}
      <div className="relative w-full max-w-2xl h-[80vh] bg-slate-900 border-x-4 border-[#2f8e47] overflow-hidden rounded-t-3xl shadow-2xl">

        {/* Lane dividers */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="flex-1 border-r border-dashed border-white/20" />
          <div className="flex-1 border-r border-dashed border-white/20" />
          <div className="flex-1" />
        </div>

        {/* START screen */}
        {gameState === 'START' && (
          <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-[#2f8e47] text-6xl mb-4">directions_car</span>
            <h1 className="text-4xl font-bold mb-2">DSA Racer</h1>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              Steer into the lane with the <span className="text-emerald-400 font-bold">correct answer</span>.
              Build streaks for <span className="text-yellow-400 font-bold">speed boosts</span>!
            </p>
            <div className="flex gap-4 items-center mb-4 text-slate-500 text-sm">
              <span className="border border-slate-700 px-3 py-1 rounded bg-slate-800">←</span>
              <span>Arrow Keys to steer</span>
              <span className="border border-slate-700 px-3 py-1 rounded bg-slate-800">→</span>
            </div>
            <div className="flex gap-3 mb-8 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="text-yellow-400">🔥</span> 2+ streak = speed boost</span>
              <span className="flex items-center gap-1"><span className="text-emerald-400">🎉</span> correct = confetti</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" checked={musicOn} onChange={e => setMusicOn(e.target.checked)} className="accent-[#2f8e47]" />
                Engine music
              </label>
            </div>
            <button
              onClick={startGame}
              className="bg-[#2f8e47] text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-[#267a3c] transition-all shadow-lg shadow-[#2f8e47]/30 hover:scale-105"
            >
              Start Engine 🏎️
            </button>
          </div>
        )}

        {/* PLAYING / CRASHED — game elements */}
        {(gameState === 'PLAYING' || gameState === 'CRASHED') && currentQ && (
          <>
            {/* Question HUD */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 border border-[#2f8e47]/50 rounded-xl px-6 py-4 z-20 w-[90%] text-center backdrop-blur-md shadow-lg">
              <p className="text-xs text-[#a3e6b7] uppercase tracking-widest mb-1">
                Question {currentQIndex + 1}/{qPool.length}
                {streak >= 2 && <span className="ml-2 text-yellow-400">🔥 {streak} streak</span>}
              </p>
              <h2 className="text-xl md:text-2xl font-bold">{currentQ.q}</h2>
            </div>

            {/* Approaching options */}
            <div
              className="absolute w-full flex text-center z-10"
              style={{ top: `${obstacleY}%` }}
            >
              {currentQ.options.map((opt, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <div className="w-3/4 py-4 rounded-xl font-bold text-sm md:text-base shadow-xl flex items-center justify-center border-b-4 bg-slate-700 border-slate-900 text-white shadow-black/50">
                    {opt}
                  </div>
                </div>
              ))}
            </div>

            {/* Player car */}
            <div className="absolute bottom-[15%] w-full flex text-center z-20">
              {[0, 1, 2].map(lane => (
                <div key={lane} className="flex-1 flex justify-center">
                  {carLane === lane && <Car isCrashed={gameState === 'CRASHED'} speed={speedRef.current} />}
                </div>
              ))}
            </div>

            {/* Mobile tap zones */}
            <div className="absolute bottom-0 w-full h-[30%] opacity-0 flex z-30">
              {[0, 1, 2].map(lane => (
                <div key={lane} className="flex-1" onClick={() => { carLaneRef.current = lane; setCarLane(lane) }} />
              ))}
            </div>
          </>
        )}

        {/* CRASHED overlay */}
        {gameState === 'CRASHED' && currentQ && (
          <div className="absolute inset-0 bg-red-900/80 z-40 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm" style={{ animation: 'fadeIn 0.5s' }}>
            <span className="material-symbols-outlined text-red-400 text-7xl mb-4 animate-bounce">car_crash</span>
            <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">CRASHED!</h2>
            <p className="text-xl text-red-200 mb-2">Correct: <span className="font-bold text-white">{currentQ.options[currentQ.correct]}</span></p>
            <p className="text-sm text-red-300 mb-6">Best streak: <span className="text-yellow-400 font-bold">{streak}</span></p>
            <p className="text-white text-2xl font-bold mb-8 bg-black/50 px-6 py-2 rounded-full border border-red-500/30">Score: {score}</p>
            <button onClick={startGame} className="bg-white text-red-900 px-8 py-4 rounded-full font-bold text-xl hover:bg-red-100 transition-colors shadow-xl">
              Try Again
            </button>
          </div>
        )}

        {/* SUCCESS overlay */}
        {gameState === 'SUCCESS' && (
          <div className="absolute inset-0 bg-emerald-900/90 z-40 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm" style={{ animation: 'fadeIn 0.5s' }}>
            <span className="material-symbols-outlined text-yellow-400 text-7xl mb-4">emoji_events</span>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">YOU SURVIVED!</h2>
            <p className="text-emerald-200 mb-2 max-w-sm">All {qPool.length} DSA questions answered correctly!</p>
            <p className="text-sm text-yellow-300 mb-6">Best streak: <span className="font-bold">{streak} 🔥</span></p>
            <p className="text-white text-2xl font-bold mb-8 bg-black/50 px-6 py-2 rounded-full border border-emerald-500/30">Score: {score}</p>
            <button onClick={startGame} className="bg-emerald-500 text-white border-2 border-emerald-400 px-8 py-4 rounded-full font-bold text-xl hover:bg-emerald-600 transition-colors shadow-xl shadow-emerald-500/30">
              Play Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scrollRoad {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes confettiFall {
          0%   { transform: translate(0, 0) rotate(var(--rot, 0deg)); opacity: 1; }
          100% { transform: translate(var(--dx, 0), var(--dy, -120px)) rotate(var(--rot, 360deg)); opacity: 0; }
        }
        @keyframes speedFlash {
          0%   { opacity: 0; transform: scale(0.5); }
          30%  { opacity: 1; transform: scale(1.2); }
          70%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}

function Car({ isCrashed, speed = 1.5 }) {
  const isBoost = speed > 3
  return (
    <div className={`relative transition-all duration-700 ease-out origin-center ${isCrashed ? 'scale-125 rotate-[720deg] drop-shadow-[0_0_30px_red]' : 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]'}`}>
      <div className={`w-16 h-24 rounded-2xl border-4 border-slate-900 relative shadow-inner transition-colors duration-300 ${isBoost ? 'bg-yellow-500' : 'bg-blue-600'}`}>
        <div className="absolute top-4 left-2 right-2 h-5 bg-sky-300 rounded-t-lg mx-1 border border-blue-800" />
        <div className="absolute bottom-3 left-2 right-2 h-3 bg-slate-800 rounded-b-md mx-1 border border-blue-800" />
        <div className={`absolute top-1 left-1 w-3 h-2 rounded-full ${isBoost ? 'bg-orange-300 shadow-[0_-5px_15px_orange]' : 'bg-yellow-200 shadow-[0_-5px_15px_yellow]'}`} />
        <div className={`absolute top-1 right-1 w-3 h-2 rounded-full ${isBoost ? 'bg-orange-300 shadow-[0_-5px_15px_orange]' : 'bg-yellow-200 shadow-[0_-5px_15px_yellow]'}`} />
        {/* Speed boost flame */}
        {isBoost && !isCrashed && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xl animate-pulse">🔥</div>
        )}
        {isCrashed && (
          <div className="absolute -inset-8 bg-red-500 rounded-full opacity-60 mix-blend-screen animate-pulse blur-md">
            <div className="w-full h-full bg-yellow-400 opacity-80 rounded-full animate-ping" />
          </div>
        )}
      </div>
    </div>
  )
}
