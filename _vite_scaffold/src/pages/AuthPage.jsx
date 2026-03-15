import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"

const BRANCHES = ["CSE","CSE-AI","CSE-DS","IT","ECE","EEE","MECH","CIVIL","Other"]
const YEARS = ["1st Year","2nd Year","3rd Year","4th Year"]

export default function AuthPage() {
  const [mode, setMode] = useState("signup")
  const [form, setForm] = useState({ name:"", email:"", password:"", branch:"CSE", year:"1st Year" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup, login } = useAuth()
  const navigate = useNavigate()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError("") }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = mode === "signup"
      ? signup(form)
      : login({ email: form.email, password: form.password })
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate("/community")
  }

  return (
    <div className="min-h-screen bg-[#032014] flex items-center justify-center px-4 py-16">
      {/* bg grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
        backgroundSize: "50px 50px"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
        className="relative w-full max-w-md"
      >
        {/* logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1 shadow-lg">
              <img src="/images/gfg-logo.png" alt="GFG" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold text-xl">GFG X RIT</span>
          </Link>
        </div>

        <div className="bg-[#0b1f12] border border-[#2f8e47]/25 rounded-3xl p-8 shadow-2xl">
          {/* tab toggle */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-7">
            {["signup","login"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError("") }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode===m ? "bg-[#2f8e47] text-white shadow" : "text-slate-400 hover:text-white"}`}>
                {m === "signup" ? "Sign Up" : "Log In"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode==="signup" ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode==="signup" ? 16 : -16 }}
              transition={{ duration: 0.22 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Full Name</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2f8e47]/60 focus:ring-1 focus:ring-[#2f8e47]/40 transition" />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
                <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2f8e47]/60 focus:ring-1 focus:ring-[#2f8e47]/40 transition" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Password</label>
                <input required type="password" value={form.password} onChange={e => set("password", e.target.value)}
                  placeholder="Min 6 characters"
                  minLength={6}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2f8e47]/60 focus:ring-1 focus:ring-[#2f8e47]/40 transition" />
              </div>

              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Branch</label>
                    <select value={form.branch} onChange={e => set("branch", e.target.value)}
                      className="w-full rounded-xl bg-[#0d2416] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2f8e47]/60 transition">
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Year</label>
                    <select value={form.year} onChange={e => set("year", e.target.value)}
                      className="w-full rounded-xl bg-[#0d2416] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#2f8e47]/60 transition">
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                  <span className="material-symbols-outlined text-red-400 text-base">error</span>
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#2f8e47] text-white font-bold py-3.5 text-sm hover:bg-[#267a3c] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  : mode === "signup" ? "Create Account" : "Log In"
                }
              </button>

              {mode === "signup" && (
                <p className="text-center text-xs text-slate-500 mt-1">
                  By signing up you agree to our community guidelines.
                </p>
              )}
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-slate-500 text-xs mt-5">
          {mode === "signup" ? "Already a member? " : "New here? "}
          <button onClick={() => { setMode(mode==="signup"?"login":"signup"); setError("") }}
            className="text-[#4ade80] hover:underline font-semibold">
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
