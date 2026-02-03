"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Team, type Athlete, type Championship, type Appeal } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  Trophy,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react"

export default function RepresentativeHomePage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [appeals, setAppeals] = useState<Appeal[]>([])

  useEffect(() => {
    if (user) {
      const userTeams = store.getTeamsByRepresentative(user.id)
      setTeams(userTeams)
      
      // Get all athletes from user's teams
      const teamAthletes = userTeams.flatMap(team => store.getAthletesByTeam(team.id))
      setAthletes(teamAthletes)
      
      // Get all championships
      setChampionships(store.getChampionships())
      
      // Get appeals from user's teams
      const teamAppeals = userTeams.flatMap(team => store.getAppealsByTeam(team.id))
      setAppeals(teamAppeals)
    }
  }, [user])

  const openChampionships = championships.filter(c => c.status === "inscricoes_abertas")
  const pendingAppeals = appeals.filter(a => a.status === "pendente")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bem-vindo, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Portal do Representante - Gerencie suas equipes e atletas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Minhas Equipes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground">{athletes.length}</p>
                <p className="text-sm text-muted-foreground">Atletas Cadastrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground">{openChampionships.length}</p>
                <p className="text-sm text-muted-foreground">Campeonatos Abertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-card-foreground">{pendingAppeals.length}</p>
                <p className="text-sm text-muted-foreground">Recursos Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Teams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground">Minhas Equipes</CardTitle>
            <Link href="/representante/equipes">
              <Button variant="outline" size="sm">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {teams.length > 0 ? (
              <div className="space-y-3">
                {teams.slice(0, 3).map((team) => {
                  const championship = store.getChampionshipById(team.championshipId)
                  const teamAthletes = store.getAthletesByTeam(team.id)
                  return (
                    <div
                      key={team.id}
                      className="p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-card-foreground">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {championship?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              team.status === "confirmada"
                                ? "bg-accent/20 text-accent"
                                : "bg-warning/20 text-warning-foreground"
                            }
                          >
                            {team.status === "confirmada" ? "Confirmada" : "Pendente"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {teamAthletes.length} atletas
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma equipe cadastrada</p>
                <Link href="/representante/equipes/nova">
                  <Button className="mt-4" size="sm">
                    Cadastrar Equipe
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Open Championships */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground">Campeonatos com Inscrições Abertas</CardTitle>
            <Link href="/representante/campeonatos">
              <Button variant="outline" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {openChampionships.length > 0 ? (
              <div className="space-y-3">
                {openChampionships.slice(0, 3).map((champ) => (
                  <div
                    key={champ.id}
                    className="p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-card-foreground">{champ.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {champ.modality} - {champ.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-accent/20 text-accent">
                          <Calendar className="w-3 h-3 mr-1" />
                          Inscrições Abertas
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Até {new Date(champ.startDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum campeonato aberto no momento</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Appeals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">Meus Recursos</CardTitle>
          <Link href="/representante/recursos">
            <Button variant="outline" size="sm">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {appeals.length > 0 ? (
            <div className="space-y-3">
              {appeals.slice(0, 3).map((appeal) => (
                <div
                  key={appeal.id}
                  className="p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-card-foreground">{appeal.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {appeal.description}
                      </p>
                    </div>
                    <Badge
                      className={
                        appeal.status === "pendente"
                          ? "bg-warning/20 text-warning-foreground"
                          : appeal.status === "deferido"
                          ? "bg-accent/20 text-accent"
                          : "bg-destructive/20 text-destructive"
                      }
                    >
                      {appeal.status === "pendente" && <Clock className="w-3 h-3 mr-1" />}
                      {appeal.status === "deferido" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {appeal.status === "pendente" ? "Pendente" : appeal.status === "deferido" ? "Deferido" : "Indeferido"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum recurso registrado</p>
              <Link href="/representante/recursos/novo">
                <Button className="mt-4" size="sm">
                  Abrir Recurso
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
