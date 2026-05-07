import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  findUserByEmail,
  getSession,
  logoutSession,
  registerUser,
  type StoredUser,
  verifyLogin,
} from './authStorage'

export type AuthUser = {
  id: string
  email: string
  fullName: string
  withdrawLockUntil: number
}

function toPublic(u: StoredUser): AuthUser {
  const { id, email, fullName, withdrawLockUntil } = u
  return { id, email, fullName, withdrawLockUntil }
}

function resolveUser(): AuthUser | null {
  const s = getSession()
  if (!s) return null
  const u = findUserByEmail(s.email)
  return u ? toPublic(u) : null
}

type AuthContextValue = {
  user: AuthUser | null
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (input: {
    email: string
    fullName: string
    password: string
  }) => 'ok' | 'exists'
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof localStorage !== 'undefined' ? resolveUser() : null,
  )

  const refreshUser = useCallback(() => {
    setUser(resolveUser())
  }, [])

  const login = useCallback((email: string, password: string) => {
    const u = verifyLogin(email, password)
    if (!u) return false
    setUser(toPublic(u))
    return true
  }, [])

  const logout = useCallback(() => {
    logoutSession()
    setUser(null)
  }, [])

  const register = useCallback(
    (input: { email: string; fullName: string; password: string }) => {
      const result = registerUser(input)
      if (!result.ok) return 'exists'
      setUser(toPublic(result.user))
      return 'ok'
    },
    [],
  )

  const value = useMemo(
    () => ({ user, login, logout, register, refreshUser }),
    [user, login, logout, register, refreshUser],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
