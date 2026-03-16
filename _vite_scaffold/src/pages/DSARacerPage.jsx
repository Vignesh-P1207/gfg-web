import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  { q: "Time Complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(1)"], correct: 1 }, // index of correct option
  { q: "Space Complexity of Merge Sort?", options: ["O(1)", "O(log n)", "O(n)"], correct: 2 },
  { q: "Data structure for BFS?", options: ["Stack", "Array", "Queue"], correct: 2 },
  { q: "Which sort is NOT stable?", options: ["Merge", "Insertion", "Quick"], correct: 2 },
  { q: "Worst-case for standard QuickSort?", options: ["O(n log n)", "O(n^2)", "O(n)"], correct: 1 },
  { q: "Access time of Array element?", options: ["O(1)", "O(n)", "O(log n)"], correct: 0 },
  { q: "Data structure for DFS?", options: ["Queue", "Hash Map", "Stack"], correct: 2 },
  { q: "Finding cycle in Linked List?", options: ["Dijkstra's", "Floyd's", "Kruskal's"], correct: 1 },
]

const playCrashSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; 
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    noiseSource.connect(filter);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noiseSource.start();
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch(e) {
    console.error('Audio api error', e);
  }
};

export default function DSARacerPage() {
  const [gameState, setGameState] = useState('START') // START, PLAYING, CRASHED, SUCCESS
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(5)
  const [carLane, setCarLane] = useState(1) // 0: Left, 1: Center, 2: Right
  
  // Current Question State
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [obstacleY, setObstacleY] = useState(-50) // Percentage from top
  
  const requestRef = useRef()
  const obstacleYRef = useRef(-50)
  const carLaneRef = useRef(1)
  const stateRef = useRef('START')

  // Generate a random question sequence
  const [qPool, setQPool] = useState([])

  // Initialize Game
  const startGame = () => {
    // Shuffle questions
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
    setQPool(shuffled)
    setCurrentQIndex(0)
    setScore(0)
    setSpeed(1.5) // Reduced initial speed (was 5)
    setCarLane(1)
    carLaneRef.current = 1
    obstacleYRef.current = -50
    stateRef.current = 'PLAYING'
    setGameState('PLAYING')
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stateRef.current !== 'PLAYING') return

      if (e.key === 'ArrowLeft') {
        setCarLane(prev => {
          const next = Math.max(0, prev - 1)
          carLaneRef.current = next
          return next
        })
      } else if (e.key === 'ArrowRight') {
        setCarLane(prev => {
          const next = Math.min(2, prev + 1)
          carLaneRef.current = next
          return next
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Game Loop
  const update = useCallback(() => {
    if (stateRef.current !== 'PLAYING') return

    // Move obstacles down
    obstacleYRef.current += speed / 5 // Adjusted modifier for speed to make it manageable
    setObstacleY(obstacleYRef.current)

    // Collision Detection (Car is around 75-85% down the screen)
    if (obstacleYRef.current > 70 && obstacleYRef.current < 90) {
       // We only check once when it hits the threshold (around 80%)
       // To prevent multiple triggers, wait for it to pass or crash
       if (obstacleYRef.current > 78 && obstacleYRef.current < 82) {
         const currentQ = qPool[currentQIndex]
         if (carLaneRef.current === currentQ.correct) {
           // Correct answer! We don't do anything here, let it pass below
         } else {
           // CRASH!
           stateRef.current = 'CRASHED'
           setGameState('CRASHED')
           playCrashSound()
           return // Stop loop
         }
       }
    }

    // Passed the car successfully
    if (obstacleYRef.current > 100) {
      setScore(s => s + 10)
      setSpeed(s => s + 0.1) // Slowly increase speed
      obstacleYRef.current = -50 // Reset position
      
      // Next question
      if (currentQIndex + 1 < qPool.length) {
        setCurrentQIndex(currentQIndex + 1)
      } else {
        // Won the game!
        stateRef.current = 'SUCCESS'
        setGameState('SUCCESS')
        return
      }
    }

    requestRef.current = requestAnimationFrame(update)
  }, [speed, currentQIndex, qPool])

  // Start/Stop Loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(update)
    }
    return () => cancelAnimationFrame(requestRef.current)
  }, [gameState, update])

  const currentQ = qPool[currentQIndex]

  return (
    <div className="bg-[#032014] min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden font-mono">
      
      {/* Background Scrolling Road Effect */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none ${gameState === 'PLAYING' ? 'animate-[scrollRoad_1s_linear_infinite]' : ''}`}
           style={{
             backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 50%)',
             backgroundSize: '100% 40px'
           }}
      />

      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="text-[#a3e6b7] hover:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span> Exit to Web
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20 text-right">
        <p className="text-[#a3e6b7] text-sm uppercase tracking-widest mb-1">Score</p>
        <p className="text-4xl font-bold">{score}</p>
      </div>

      {/* Main Game Area */}
      <div className="relative w-full max-w-2xl h-[80vh] bg-slate-900 border-x-4 border-[#2f8e47] overflow-hidden rounded-t-3xl shadow-2xl">
        
        {/* The Road Lanes */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-dashed border-white/20 relative"></div>
          <div className="flex-1 border-r border-dashed border-white/20 relative"></div>
          <div className="flex-1 relative"></div>
        </div>

        {gameState === 'START' && (
          <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-[#2f8e47] text-6xl mb-4">directions_car</span>
            <h1 className="text-4xl font-bold mb-2">DSA Racer</h1>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">Steer your car into the lane with the <span className="text-emerald-400 font-bold">correct answer</span> to the DSA question. Don't crash!</p>
            <div className="flex gap-4 items-center mb-8 text-slate-500">
              <span className="border border-slate-700 px-3 py-1 rounded bg-slate-800">←</span>
              <span>Use Arrow Keys</span>
              <span className="border border-slate-700 px-3 py-1 rounded bg-slate-800">→</span>
            </div>
            <button 
              onClick={startGame}
              className="bg-[#2f8e47] text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-[#267a3c] transition-colors shadow-lg shadow-[#2f8e47]/30 hover:scale-105"
            >
              Start Engine
            </button>
          </div>
        )}

        {(gameState === 'PLAYING' || gameState === 'CRASHED') && currentQ && (
          <>
            {/* The Question HUD */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 border border-[#2f8e47]/50 rounded-xl px-6 py-4 z-20 w-[90%] text-center backdrop-blur-md shadow-lg shadow-[#2f8e47]/10">
              <p className="text-xs text-[#a3e6b7] uppercase tracking-widest mb-1">Question {currentQIndex + 1}/{qPool.length}</p>
              <h2 className="text-xl md:text-2xl font-bold">{currentQ.q}</h2>
            </div>
            
            {/* The Approaching Options / Obstacles */}
            <div 
              className="absolute w-full flex text-center z-10 transition-none"
              style={{ top: `${obstacleY}%` }}
            >
              {currentQ.options.map((opt, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <div className={`w-3/4 py-4 rounded-xl font-bold text-sm md:text-lg shadow-xl flex items-center justify-center border-b-4 bg-slate-700 border-slate-900 shadow-black/50`}>
                    {opt}
                  </div>
                </div>
              ))}
            </div>
            
            {/* The Player Car */}
            <div 
              className="absolute bottom-[15%] w-full flex text-center z-20 transition-transform duration-100 ease-out"
            >
              <div className="flex-1 flex justify-center relative">
                {carLane === 0 && <Car isCrashed={gameState === 'CRASHED'} />}
              </div>
              <div className="flex-1 flex justify-center relative">
                {carLane === 1 && <Car isCrashed={gameState === 'CRASHED'} />}
              </div>
              <div className="flex-1 flex justify-center relative">
                {carLane === 2 && <Car isCrashed={gameState === 'CRASHED'} />}
              </div>
            </div>

            {/* Tap Controls for Mobile */}
            <div className="absolute bottom-0 w-full h-[30%] opacity-0 flex z-30">
              <div className="flex-1" onClick={() => setCarLane(0)}></div>
              <div className="flex-1" onClick={() => setCarLane(1)}></div>
              <div className="flex-1" onClick={() => setCarLane(2)}></div>
            </div>
          </>
        )}

        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 bg-red-900/80 z-40 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-[fadeIn_0.5s]">
            <span className="material-symbols-outlined text-red-400 text-7xl mb-4 animate-bounce">car_crash</span>
            <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">CRASHED!</h2>
            <p className="text-xl text-red-200 mb-8">Correct Answer: {currentQ.options[currentQ.correct]}</p>
            <p className="text-white text-2xl font-bold mb-8 badge bg-black/50 px-6 py-2 rounded-full border border-red-500/30">Score: {score}</p>
            <button 
              onClick={startGame}
              className="bg-white text-red-900 px-8 py-4 rounded-full font-bold text-xl hover:bg-red-100 transition-colors shadow-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {gameState === 'SUCCESS' && (
          <div className="absolute inset-0 bg-emerald-900/90 z-40 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-[fadeIn_0.5s]">
            <span className="material-symbols-outlined text-yellow-400 text-7xl mb-4">emoji_events</span>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">YOU SURVIVED!</h2>
            <p className="text-emerald-200 mb-8 max-w-sm">You answered all DSA questions correctly without a single crash.</p>
            <p className="text-white text-2xl font-bold mb-8 badge bg-black/50 px-6 py-2 rounded-full border border-emerald-500/30">Perfect Score: {score}</p>
            <button 
              onClick={startGame}
              className="bg-emerald-500 text-white border-2 border-emerald-400 px-8 py-4 rounded-full font-bold text-xl hover:bg-emerald-600 transition-colors shadow-xl shadow-emerald-500/30"
            >
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function Car({ isCrashed }) {
  return (
    <div className={`relative transition-all duration-700 ease-out origin-center ${isCrashed ? 'scale-125 rotate-[720deg] drop-shadow-[0_0_30px_red]' : 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]'}`}>
      {/* Tiny CSS Car */}
      <div className="w-16 h-24 bg-blue-600 rounded-2xl border-4 border-slate-900 relative shadow-inner">
        {/* Windshield */}
        <div className="absolute top-4 left-2 right-2 h-5 bg-sky-300 rounded-t-lg mx-1 border border-blue-800"></div>
        {/* Rear window */}
        <div className="absolute bottom-3 left-2 right-2 h-3 bg-slate-800 rounded-b-md mx-1 border border-blue-800"></div>
        {/* Headlights */}
        <div className="absolute top-1 left-1 w-3 h-2 bg-yellow-200 rounded-full shadow-[0_-5px_15px_yellow]"></div>
        <div className="absolute top-1 right-1 w-3 h-2 bg-yellow-200 rounded-full shadow-[0_-5px_15px_yellow]"></div>
        {/* Explosion overlay if crashed */}
        {isCrashed && (
          <div className="absolute -inset-8 bg-red-500 rounded-full opacity-60 mix-blend-screen animate-pulse blur-md flex items-center justify-center">
            <div className="w-full h-full bg-yellow-400 opacity-80 rounded-full animate-ping"></div>
          </div>
        )}
      </div>
    </div>
  )
}
