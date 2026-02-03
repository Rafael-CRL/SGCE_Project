"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AthleteSidebar } from "@/components/athlete-sidebar"

export default function AthleteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
    if (!isLoading && user && user.role !== "atleta") {
      // Redirect to appropriate portal
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "representante") {
        router.push("/representante")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user || user.role !== "atleta") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AthleteSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
