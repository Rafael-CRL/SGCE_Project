"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Team } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Plus,
  UserPlus,
  Trophy,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react"

export default function RepresentativeTeamsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    if (user) {
      setTeams(store.getTeamsByRepresentative(user.id))
    }
  }, [user])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minhas Equipes</h1>
          <p className="text-muted-foreground">
            Gerencie suas equipes inscritas nos campeonatos
          </p>
        </div>
        <Link href="/representante/equipes/nova">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Equipe
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Total de Equipes</p>
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
                <p className="text-2xl font-bold text-card-foreground">
                  {teams.filter(t => t.status === "confirmada").length}
                </p>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
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
                <p className="text-2xl font-bold text-card-foreground">
                  {teams.filter(t => t.status === "pendente" || t.status === "inscrita").length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Equipes Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length > 0 ? (
            <div className="space-y-4">
              {teams.map((team) => {
                const championship = store.getChampionshipById(team.championshipId)
                const athletes = store.getAthletesByTeam(team.id)
                return (
                  <div
                    key={team.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-card-foreground">{team.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            {championship?.name}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <UserPlus className="w-4 h-4" />
                            {athletes.length} atletas cadastrados
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={
                            team.status === "confirmada"
                              ? "bg-accent/20 text-accent"
                              : "bg-warning/20 text-warning-foreground"
                          }
                        >
                          {team.status === "confirmada" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {team.status !== "confirmada" && <Clock className="w-3 h-3 mr-1" />}
                          {team.status === "confirmada" ? "Confirmada" : "Pendente"}
                        </Badge>
                        <div className="flex gap-2">
                          <Link href={`/representante/equipes/${team.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalhes
                            </Button>
                          </Link>
                          <Link href={`/representante/atletas/novo?teamId=${team.id}`}>
                            <Button size="sm">
                              <UserPlus className="w-4 h-4 mr-1" />
                              Adicionar Atleta
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                Nenhuma equipe cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Inscreva sua primeira equipe em um campeonato
              </p>
              <Link href="/representante/equipes/nova">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Equipe
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
