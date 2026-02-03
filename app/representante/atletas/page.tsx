"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { store, type Team, type Athlete } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserPlus,
  Plus,
  Search,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react"

export default function RepresentativeAthletesPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")

  useEffect(() => {
    if (user) {
      const userTeams = store.getTeamsByRepresentative(user.id)
      setTeams(userTeams)
      
      const teamAthletes = userTeams.flatMap(team => store.getAthletesByTeam(team.id))
      setAthletes(teamAthletes)
    }
  }, [user])

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = selectedTeam === "all" || athlete.teamId === selectedTeam
    return matchesSearch && matchesTeam
  })

  const activeAthletes = athletes.filter(a => a.status === "ativo")
  const pendingAthletes = athletes.filter(a => a.status === "pendente")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Atletas</h1>
          <p className="text-muted-foreground">
            Gerencie os atletas das suas equipes
          </p>
        </div>
        <Link href="/representante/atletas/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Atleta
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{athletes.length}</p>
                <p className="text-sm text-muted-foreground">Total de Atletas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{activeAthletes.length}</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{pendingAthletes.length}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou posição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as equipes</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Athletes List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Atletas ({filteredAthletes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAthletes.map((athlete) => {
                const team = teams.find(t => t.id === athlete.teamId)
                return (
                  <div
                    key={athlete.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={athlete.photo || "/placeholder.svg"}
                          alt={athlete.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">{athlete.name}</h3>
                        <p className="text-sm text-muted-foreground">{athlete.position}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3" />
                          {team?.name}
                        </p>
                      </div>
                      <Badge
                        className={
                          athlete.status === "ativo"
                            ? "bg-accent/20 text-accent h-fit"
                            : "bg-warning/20 text-warning-foreground h-fit"
                        }
                      >
                        {athlete.status === "ativo" ? "Ativo" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                Nenhum atleta encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedTeam !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Cadastre seus primeiros atletas"
                }
              </p>
              <Link href="/representante/atletas/novo">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Atleta
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
