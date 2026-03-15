import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gfg_user")) } catch { return null }
  })

  function signup({ name, email, password, branch, year }) {
    const users = JSON.parse(localStorage.getItem("gfg_users") || "[]")
    if (users.find(u => u.email === email)) return { error: "Email already registered." }
    const newUser = { name, email, password, branch, year, joinedAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem("gfg_users", JSON.stringify(users))
    const session = { name, email, branch, year, joinedAt: newUser.joinedAt }
    localStorage.setItem("gfg_user", JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function login({ email, password }) {
    const users = JSON.parse(localStorage.getItem("gfg_users") || "[]")
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { error: "Invalid email or password." }
    const session = { name: found.name, email: found.email, branch: found.branch, year: found.year, joinedAt: found.joinedAt }
    localStorage.setItem("gfg_user", JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem("gfg_user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
