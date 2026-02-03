"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { RepresentativeSidebar } from "@/components/representative-sidebar"

export default function RepresentativeLayout({
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
    if (!isLoading && user && user.role !== "representante") {
      // Redirect to appropriate portal
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "atleta") {
        router.push("/atleta")
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

  if (!user || user.role !== "representante") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <RepresentativeSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
