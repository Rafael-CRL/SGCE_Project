"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { store, type User } from "./store"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => User | null
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = store.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): User | null => {
    const loggedUser = store.login(email, password)
    setUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    store.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
