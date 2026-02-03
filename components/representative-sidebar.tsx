"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Home,
  Users,
  UserPlus,
  Flag,
  FileText,
  HelpCircle,
  LogOut,
  UserCircle,
} from "lucide-react"

const menuItems = [
  { href: "/representante", label: "Início", icon: Home },
  { href: "/representante/equipes", label: "Minhas Equipes", icon: Users },
  { href: "/representante/atletas", label: "Atletas", icon: UserPlus },
  { href: "/representante/campeonatos", label: "Campeonatos", icon: Flag },
  { href: "/representante/recursos", label: "Recursos", icon: FileText },
]

const bottomItems = [
  { href: "/representante/ajuda", label: "Ajuda", icon: HelpCircle },
]

export function RepresentativeSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/representante" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">SGCE</h1>
            <p className="text-xs text-sidebar-foreground/70 leading-tight">
              Portal do<br />Representante
            </p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
            <UserCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-sm text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70">Representante</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/representante" && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
