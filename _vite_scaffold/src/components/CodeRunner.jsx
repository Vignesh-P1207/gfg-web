import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from '@codemirror/language'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { useAuth } from '../context/AuthContext'
import { API_BASE } from '../config/api'

// ─── Constants ────────────────────────────────────────────────────────────────
const LOCKOUT_MS = 24 * 60 * 60 * 1000 // 24 hours
const MAX_WARNINGS = 3                   // violations before lockout

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', ext: javascript, icon: 'JS' },
  { id: 'python',     name: 'Python',     ext: python,     icon: 'PY' },
  { id: 'cpp',        name: 'C++',        ext: cpp,        icon: 'C++' },
  { id: 'java',       name: 'Java',       ext: java,       icon: 'JV' },
]

const STARTER_TEMPLATES = {
  javascript: (problem) => {
    const sig = problem?.jsSignature || 'function solve(...args)'
    return `${sig} {\n  // Write your solution here\n\n  return null;\n}\n`
  },
  python: (problem) => {
    const sig = problem?.pySignature || 'def solve(*args):'
    return `${sig}\n    # Write your solution here\n    pass\n\n# Test your solution (optional — test cases run automatically)\n`
  },
  cpp: () => `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n    void solve() {\n\n    }\n};\n\nint main() {\n    Solution sol;\n    sol.solve();\n    return 0;\n}\n`,
  java: () => `import java.util.*;\n\npublic class Solution {\n    // Write your solution here\n    public void solve() {\n\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        sol.solve();\n    }\n}\n`,
}

// ─── CodeMirror theme ─────────────────────────────────────────────────────────
const gfgDarkTheme = EditorView.theme({
  '&': { backgroundColor: '#0d1117', color: '#c9d1d9', fontSize: '14px', fontFamily: "'JetBrains Mono','Fira Code',monospace" },
  '.cm-content': { caretColor: '#2f8e47', padding: '12px 0' },
  '.cm-cursor,.cm-dropCursor': { borderLeftColor: '#2f8e47', borderLeftWidth: '2px' },
  '.cm-gutters': { backgroundColor: '#0d1117', color: '#484f58', border: 'none', paddingRight: '8px' },
  '.cm-activeLineGutter': { backgroundColor: '#161b22', color: '#2f8e47' },
  '.cm-activeLine': { backgroundColor: '#161b2240' },
  '.cm-matchingBracket': { backgroundColor: '#2f8e4725', outline: '1px solid #2f8e47' },
}, { dark: true })

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalize(val) {
  if (val === null || val === undefined) return 'null'
  if (typeof val === 'boolean') return String(val)
  if (typeof val === 'number') return String(val)
  if (Array.isArray(val)) return JSON.stringify(val)
  if (typeof val === 'string') {
    // Try to parse as JSON first (handles Python json.dumps output like "[0, 1]" or "true")
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return JSON.stringify(parsed)
      if (typeof parsed === 'boolean') return String(parsed)
      if (typeof parsed === 'number') return String(parsed)
    } catch {}
    return val.replace(/^["']|["']$/g, '').trim()
  }
  return String(val)
}

function runJsTestCases(code, problem) {
  const testCases = problem?.testCases
  if (!testCases?.length) return []
  return testCases.map((tc, i) => {
    try {
      const runner = new Function(`${code}\nreturn (function(){ return (${tc.call}); })();`)
      const actual = runner()
      const actualStr = normalize(actual)
      const expectedStr = normalize(tc.expected)
      return { case: i + 1, input: tc.display, expected: expectedStr, actual: actualStr, passed: actualStr === expectedStr }
    } catch (err) {
      return { case: i + 1, input: tc.display, expected: normalize(tc.expected), actual: `Error: ${err.message}`, passed: false }
    }
  })
}

// ─── Anti-cheat localStorage helpers ─────────────────────────────────────────
function getLockoutKey(problemId) { return `gfg_lockout_${problemId}` }
function getWarningKey(problemId) { return `gfg_warnings_${problemId}` }

function getLockoutExpiry(problemId) {
  const val = localStorage.getItem(getLockoutKey(problemId))
  return val ? parseInt(val, 10) : null
}

function isLockedOut(problemId) {
  const expiry = getLockoutExpiry(problemId)
  if (!expiry) return false
  if (Date.now() < expiry) return true
  // expired — clean up
  localStorage.removeItem(getLockoutKey(problemId))
  localStorage.removeItem(getWarningKey(problemId))
  return false
}

function getWarnings(problemId) {
  return parseInt(localStorage.getItem(getWarningKey(problemId)) || '0', 10)
}

function addWarning(problemId) {
  const w = getWarnings(problemId) + 1
  localStorage.setItem(getWarningKey(problemId), String(w))
  if (w >= MAX_WARNINGS) {
    localStorage.setItem(getLockoutKey(problemId), String(Date.now() + LOCKOUT_MS))
  }
  return w
}

function formatCountdown(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

// ─── Warning Overlay Component ────────────────────────────────────────────────
function WarningOverlay({ warnings, onDismiss }) {
  const remaining = MAX_WARNINGS - warnings
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a0a0a] border border-red-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-red-500/20">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-red-400">warning</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-400 mb-1">Tab Switch Detected!</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Switching tabs during a coding session is a violation of our integrity policy.
            </p>
          </div>
          <div className="w-full bg-[#0d1117] rounded-xl p-4 border border-red-500/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Violations</span>
              <span className="text-xs font-bold text-red-400">{warnings} / {MAX_WARNINGS}</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: MAX_WARNINGS }).map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < warnings ? 'bg-red-500' : 'bg-slate-700'}`} />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {remaining > 0
                ? `${remaining} more violation${remaining > 1 ? 's' : ''} will lock you out for 24 hours.`
                : 'Next violation will lock you out for 24 hours.'}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-sm border border-red-500/30 transition-colors"
          >
            I Understand — Return to Problem
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Lockout Screen Component ─────────────────────────────────────────────────
function LockoutScreen({ problemId }) {
  const [remaining, setRemaining] = useState(getLockoutExpiry(problemId) - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const r = getLockoutExpiry(problemId) - Date.now()
      if (r <= 0) {
        clearInterval(interval)
        window.location.reload()
      } else {
        setRemaining(r)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [problemId])

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-red-400">lock</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">Code Execution Locked</h2>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
          You have been locked out due to repeated tab switching violations. Code execution will be re-enabled after the cooldown period.
        </p>
      </div>
      <div className="bg-[#0d1117] border border-red-500/20 rounded-2xl px-10 py-6">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Time Remaining</p>
        <p className="text-4xl font-mono font-bold text-red-400 tabular-nums">{formatCountdown(Math.max(0, remaining))}</p>
      </div>
      <div className="bg-[#161b22] border border-slate-700/50 rounded-xl p-4 max-w-sm text-left">
        <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-[#2f8e47]">info</span>
          Why was I locked out?
        </p>
        <ul className="text-xs text-slate-500 space-y-1">
          <li>• You switched tabs {MAX_WARNINGS} or more times during a session</li>
          <li>• This is a violation of our academic integrity policy</li>
          <li>• The lockout resets automatically after 24 hours</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Paste Block Extension for CodeMirror ─────────────────────────────────────
function createPasteBlockExtension(onPasteAttempt) {
  return EditorView.domEventHandlers({
    paste(event) {
      event.preventDefault()
      onPasteAttempt()
      return true
    },
    drop(event) {
      event.preventDefault()
      return true
    },
  })
}

// ─── Main CodeRunner Component ────────────────────────────────────────────────
export default function CodeRunner({ problem, compact = false }) {
  const problemId = problem?.id ?? 'global'
  const { user } = useAuth()
  const antiCheatEnabled = !!user  // only enforce when logged in

  // ── Anti-cheat state ──
  const [lockedOut, setLockedOut]         = useState(() => antiCheatEnabled && isLockedOut(problemId))
  const [warnings, setWarnings]           = useState(() => antiCheatEnabled ? getWarnings(problemId) : 0)
  const [showWarning, setShowWarning]     = useState(false)
  const [showPasteToast, setShowPasteToast] = useState(false)
  const pasteToastTimer                   = useRef(null)

  // ── Editor state ──
  const [language, setLanguage]           = useState('javascript')
  const [output, setOutput]               = useState([])
  const [isRunning, setIsRunning]         = useState(false)
  const [testResults, setTestResults]     = useState([])
  const [activeTab, setActiveTab]         = useState('output')
  const [executionTime, setExecutionTime] = useState(null)
  const editorRef                         = useRef(null)
  const viewRef                           = useRef(null)

  // ── Tab-switch detection ──
  useEffect(() => {
    if (!antiCheatEnabled) return
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isLockedOut(problemId)) return
        const w = addWarning(problemId)
        setWarnings(w)
        if (w >= MAX_WARNINGS) {
          setLockedOut(true)
        } else {
          setShowWarning(true)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [problemId, antiCheatEnabled])

  // ── Paste toast helper ──
  const triggerPasteToast = useCallback(() => {
    setShowPasteToast(true)
    clearTimeout(pasteToastTimer.current)
    pasteToastTimer.current = setTimeout(() => setShowPasteToast(false), 3000)
  }, [])

  // ── Starter code ──
  const getStarterCode = useCallback(() => {
    return STARTER_TEMPLATES[language]?.(problem) || '// Write your code here\n'
  }, [language, problem])

  // ── CodeMirror init ──
  useEffect(() => {
    if (!editorRef.current) return
    const langExt = LANGUAGES.find(l => l.id === language)?.ext
    const startState = EditorState.create({
      doc: getStarterCode(),
      extensions: [
        lineNumbers(), highlightActiveLineGutter(), highlightSpecialChars(),
        history(), drawSelection(), EditorState.allowMultipleSelections.of(true),
        indentOnInput(), syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(), closeBrackets(), autocompletion(), highlightActiveLine(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        langExt ? langExt() : [],
        oneDark, gfgDarkTheme, EditorView.lineWrapping,
        createPasteBlockExtension(antiCheatEnabled ? triggerPasteToast : () => {}),
      ],
    })
    if (viewRef.current) viewRef.current.destroy()
    const view = new EditorView({ state: startState, parent: editorRef.current })
    viewRef.current = view
    return () => view.destroy()
  }, [language, getStarterCode, triggerPasteToast])

  const getCode = () => viewRef.current?.state.doc.toString() || ''

  // ── Run code ──
  const runCode = async () => {
    if (antiCheatEnabled && (lockedOut || isLockedOut(problemId))) {
      setLockedOut(true)
      return
    }

    setIsRunning(true)
    setOutput([])
    setTestResults([])
    setActiveTab('output')

    const code = getCode()
    const startTime = performance.now()

    if (language === 'javascript') {
      try {
        const logs = []
        const origLog   = console.log
        const origError = console.error
        const origWarn  = console.warn
        console.log   = (...a) => logs.push({ type: 'log',   text: a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ') })
        console.error = (...a) => logs.push({ type: 'error', text: a.map(x => String(x)).join(' ') })
        console.warn  = (...a) => logs.push({ type: 'warn',  text: a.map(x => String(x)).join(' ') })
        try { new Function(code)() } catch (e) { logs.push({ type: 'error', text: `❌ ${e.name}: ${e.message}` }) }
        console.log = origLog; console.error = origError; console.warn = origWarn
        setExecutionTime((performance.now() - startTime).toFixed(2))
        setOutput(logs.length ? logs : [{ type: 'info', text: '✓ Code executed (no console output)' }])
        const tcResults = runJsTestCases(code, problem)
        setTestResults(tcResults)
        if (tcResults.length > 0) setActiveTab('tests')
      } catch (error) {
        setExecutionTime((performance.now() - startTime).toFixed(2))
        setOutput([{ type: 'error', text: `❌ ${error.name}: ${error.message}` }])
      }
    } else {
      try {
        const langMap = { python: 'python', cpp: 'c++', java: 'java' }

        // ── Python: inject per-test-case harness ──────────────────────────────
        let finalCode = code
        if (language === 'python' && problem?.testCases?.length && problem.pyFnName) {
          // Detect the actual function name from the user's code (first `def`)
          const defMatch = code.match(/^def\s+(\w+)\s*\(/m)
          const fnName = defMatch ? defMatch[1] : problem.pyFnName

          const casesLiteral = problem.testCases.map(tc => `[${tc.pyArgs}]`).join(', ')
          // __fn__ is resolved inside the try block so a missing def shows a clean error per case
          const harness = [
            '',
            'import json as __json__',
            `__cases__ = [${casesLiteral}]`,
            '__i__ = 0',
            'for __args__ in __cases__:',
            '    try:',
            `        __fn__ = ${fnName}`,
            '        __r__ = __fn__(*__args__)',
            '        print("__TC_" + str(__i__) + "__:" + __json__.dumps(__r__))',
            '    except Exception as __e__:',
            '        print("__TC_" + str(__i__) + "__:__ERR__:" + str(__e__))',
            '    __i__ += 1',
          ].join('\n')
          finalCode = code + '\n' + harness
        }

        const response = await fetch(`${API_BASE}/api/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: langMap[language], version: '3.10.0', files: [{ content: finalCode }] }),
        })
        const data = await response.json()
        setExecutionTime((performance.now() - startTime).toFixed(2))

        if (response.ok && data.run) {
          const { stdout, stderr } = data.run
          const allLines = (stdout || '').replace(/\r/g, '').split('\n')

          if (language === 'python' && problem?.testCases?.length) {
            // Separate harness output lines from user console output
            const tcMap = {}
            const userOutputLines = []
            for (const line of allLines) {
              const trimmed = line.trim()
              const match = trimmed.match(/^__TC_(\d+)__:(.*)$/)
              if (match) {
                tcMap[parseInt(match[1])] = match[2]
              } else if (trimmed) {
                userOutputLines.push(trimmed)
              }
            }

            // Filter stderr — remove harness internals and temp file tracebacks
            const cleanStderr = (stderr || '')
              .split('\n')
              .filter(l => !l.includes('script_') && !l.includes('__fn__') && !l.includes('__cases__') && !l.includes('__TC_') && !l.includes('__json__') && !l.includes('__args__') && !l.includes('__r__') && !l.includes('__i__'))
              .join('\n')
              .trim()

            // Build console output — only user's own print() lines
            const outLines = []
            if (userOutputLines.length) outLines.push({ type: 'log', text: userOutputLines.join('\n') })
            if (cleanStderr) outLines.push({ type: 'error', text: cleanStderr })
            if (!outLines.length) outLines.push({ type: 'info', text: '✓ Code executed (no console output)' })
            setOutput(outLines)

            // Build test results — friendly error messages, no raw harness output
            const allFailed = Object.values(tcMap).every(v => v.startsWith('__ERR__:'))
            const firstErr = allFailed && tcMap[0] ? tcMap[0].slice(8) : null
            const friendlyErr = firstErr
              ? (firstErr.includes('not defined') ? 'Function not found — check your function name matches the signature' : firstErr)
              : null

            const results = problem.testCases.map((tc, i) => {
              const raw = tcMap[i]
              if (raw === undefined) return { case: i + 1, input: tc.display, expected: normalize(tc.expected), actual: 'No output', passed: false }
              if (raw.startsWith('__ERR__:')) {
                const msg = raw.slice(8)
                const display = msg.includes('not defined')
                  ? 'Function not found — check your function name'
                  : `Error: ${msg}`
                return { case: i + 1, input: tc.display, expected: normalize(tc.expected), actual: display, passed: false }
              }
              let parsed
              try { parsed = JSON.parse(raw) } catch { parsed = raw }
              const actualStr = normalize(parsed)
              const expectedStr = normalize(tc.expected)
              return { case: i + 1, input: tc.display, expected: expectedStr, actual: actualStr, passed: actualStr === expectedStr }
            })
            setTestResults(results)
            // Show a hint in console if function name mismatch
            if (friendlyErr && !userOutputLines.length && !cleanStderr) {
              setOutput([{ type: 'warn', text: `⚠️ ${friendlyErr}` }])
            }
            setActiveTab('tests')
          } else {
            // C++ / Java — just show stdout
            const outLines = []
            if (stdout) outLines.push({ type: 'log', text: stdout })
            if (stderr) outLines.push({ type: 'error', text: stderr })
            if (!outLines.length) outLines.push({ type: 'info', text: '✓ Code executed (no output)' })
            setOutput(outLines)
          }
        } else {
          setOutput([{ type: 'error', text: data.error || 'Execution failed' }])
        }
      } catch (err) {
        setExecutionTime((performance.now() - startTime).toFixed(2))
        setOutput([{ type: 'error', text: `❌ Request failed: ${err.message}` }])
      }
    }
    setIsRunning(false)
  }

  const resetCode = () => {
    viewRef.current?.dispatch({ changes: { from: 0, to: viewRef.current.state.doc.length, insert: getStarterCode() } })
  }

  // ── Render: locked out ──
  if (antiCheatEnabled && lockedOut) return <LockoutScreen problemId={problemId} />

  return (
    <>
      {/* Warning overlay */}
      {antiCheatEnabled && showWarning && (
        <WarningOverlay warnings={warnings} onDismiss={() => setShowWarning(false)} />
      )}

      {/* Paste blocked toast */}
      {antiCheatEnabled && showPasteToast && (
        <div className="fixed bottom-6 right-6 z-[9998] flex items-center gap-3 bg-[#1a0a0a] border border-orange-500/50 text-orange-400 text-sm font-bold px-5 py-3 rounded-xl shadow-xl shadow-orange-500/10 animate-fade-in">
          <span className="material-symbols-outlined text-lg">content_paste_off</span>
          Paste is disabled — type your solution manually.
        </div>
      )}

      <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-4'}`}>

        {/* Anti-cheat status bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d1117] border border-slate-700/50 rounded-lg text-[10px] font-bold">
          <div className="flex items-center gap-2 text-slate-500">
            <span className={`material-symbols-outlined text-xs ${antiCheatEnabled ? 'text-[#2f8e47]' : 'text-slate-600'}`}>security</span>
            {antiCheatEnabled ? (
              <>
                <span>Integrity Monitor Active</span>
                <span className="text-slate-700">•</span>
                <span className="text-slate-600">Paste disabled</span>
                <span className="text-slate-700">•</span>
                <span className="text-slate-600">Tab switching monitored</span>
              </>
            ) : (
              <span className="text-slate-600">Login to enable integrity monitoring & track progress</span>
            )}
          </div>
          {antiCheatEnabled && warnings > 0 && (
            <div className="flex items-center gap-1.5 text-orange-400">
              <span className="material-symbols-outlined text-xs">warning</span>
              <span>{warnings}/{MAX_WARNINGS} violations</span>
              <div className="flex gap-0.5 ml-1">
                {Array.from({ length: MAX_WARNINGS }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < warnings ? 'bg-orange-400' : 'bg-slate-700'}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editor Header */}
        <div className="bg-[#161b22] rounded-t-xl border border-slate-700 border-b-0">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-slate-400 font-mono">
                solution.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-[#0d1117] rounded-lg p-0.5 gap-0.5">
                {LANGUAGES.map(lang => (
                  <button key={lang.id} onClick={() => setLanguage(lang.id)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === lang.id ? 'bg-[#2f8e47] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    {lang.icon}
                  </button>
                ))}
              </div>
              <button onClick={resetCode} className="text-slate-500 hover:text-white transition-colors p-1 rounded" title="Reset code">
                <span className="material-symbols-outlined text-sm">restart_alt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div ref={editorRef} className="bg-[#0d1117] border-x border-slate-700 overflow-auto"
          style={{ minHeight: compact ? '200px' : '300px', maxHeight: compact ? '350px' : '500px' }}
          onContextMenu={e => e.preventDefault()}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 -mt-4 bg-[#161b22] px-4 py-3 rounded-b-xl border border-slate-700 border-t-0">
          <button onClick={runCode} disabled={isRunning}
            className={`flex-1 rounded-xl text-white text-sm font-bold py-3 flex items-center justify-center gap-2 transition-all ${isRunning ? 'bg-[#2f8e47]/50 cursor-wait' : 'bg-[#2f8e47] hover:bg-[#267a3c] hover:shadow-lg hover:shadow-[#2f8e47]/20'}`}>
            {isRunning
              ? <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>Running...</>
              : <><span className="material-symbols-outlined text-lg">play_arrow</span>Run Code</>}
          </button>
          <button onClick={() => { runCode(); setActiveTab('tests') }} disabled={isRunning}
            className="rounded-xl bg-[#032014] text-white text-sm font-bold py-3 px-6 hover:bg-[#0a3a25] transition-colors flex items-center justify-center gap-2 border border-[#2f8e47]/20">
            <span className="material-symbols-outlined text-lg">check_circle</span>Submit
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-[#0d1117] rounded-xl border border-slate-700 overflow-hidden">
          <div className="flex items-center gap-1 px-3 py-2 bg-[#161b22] border-b border-slate-700">
            <button onClick={() => setActiveTab('output')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'output' ? 'bg-[#2f8e47]/20 text-[#2f8e47]' : 'text-slate-400 hover:text-white'}`}>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">terminal</span>Console</span>
            </button>
            <button onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'tests' ? 'bg-[#2f8e47]/20 text-[#2f8e47]' : 'text-slate-400 hover:text-white'}`}>
              <span className="material-symbols-outlined text-sm">checklist</span>Test Cases
              {testResults.length > 0 && (
                <span className={`ml-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${testResults.every(t => t.passed) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {testResults.filter(t => t.passed).length}
                </span>
              )}
            </button>
            {executionTime && (
              <span className="ml-auto text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">timer</span>{executionTime}ms
              </span>
            )}
          </div>

          {activeTab === 'output' && (
            <div className="p-4 font-mono text-sm max-h-52 overflow-auto" style={{ minHeight: '80px' }}>
              {output.length === 0
                ? <p className="text-slate-600 italic text-xs">Click "Run Code" to see output here...</p>
                : output.map((line, i) => (
                  <div key={i} className={`py-0.5 ${line.type === 'error' ? 'text-red-400' : line.type === 'warn' ? 'text-yellow-400' : line.type === 'result' ? 'text-[#a3e6b7] font-bold' : line.type === 'info' ? 'text-blue-400' : 'text-slate-300'}`}>
                    {line.text}
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="p-4 max-h-64 overflow-auto">
              {testResults.length === 0
                ? <div className="text-center py-6">
                    <span className="material-symbols-outlined text-3xl text-slate-600 block mb-2">science</span>
                    <p className="text-slate-600 text-xs">Run your code to see test results</p>
                  </div>
                : <div className="flex flex-col gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold ${testResults.every(t => t.passed) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      <span className="material-symbols-outlined text-lg">{testResults.every(t => t.passed) ? 'check_circle' : 'cancel'}</span>
                      {testResults.every(t => t.passed) ? `All ${testResults.length} test cases passed!` : `${testResults.filter(t => t.passed).length}/${testResults.length} test cases passed`}
                    </div>
                    {testResults.map(tr => (
                      <div key={tr.case} className={`rounded-lg border p-3 ${tr.passed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`material-symbols-outlined text-sm ${tr.passed ? 'text-emerald-400' : 'text-red-400'}`}>{tr.passed ? 'check_circle' : 'cancel'}</span>
                          <span className="text-xs font-bold text-slate-300">Test Case {tr.case}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1 text-xs font-mono">
                          <div className="flex gap-2"><span className="text-slate-500 w-16 flex-shrink-0">Input:</span><span className="text-slate-300">{tr.input}</span></div>
                          <div className="flex gap-2"><span className="text-slate-500 w-16 flex-shrink-0">Expected:</span><span className="text-emerald-400">{tr.expected}</span></div>
                          <div className="flex gap-2"><span className="text-slate-500 w-16 flex-shrink-0">Output:</span><span className={tr.passed ? 'text-emerald-400' : 'text-red-400'}>{tr.actual}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
