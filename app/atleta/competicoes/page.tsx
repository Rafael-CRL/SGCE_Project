"use client"

import { useEffect, useState } from "react"
import { store, type Athlete, type Team, type Championship, type Draw } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react"

export default function AthleteCompetitionsPage() {
  const { user } = useAuth()
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [championship, setChampionship] = useState<Championship | null>(null)
  const [draw, setDraw] = useState<Draw | null>(null)

  useEffect(() => {
    if (user?.athleteId) {
      const athleteData = store.getAthleteById(user.athleteId)
      if (athleteData) {
        setAthlete(athleteData)
        
        const teamData = store.getTeamById(athleteData.teamId)
        if (teamData) {
          setTeam(teamData)
          
          const champData = store.getChampionshipById(teamData.championshipId)
          setChampionship(champData || null)
          
          // Get draw for this championship
          const draws = store.getDrawsByChampionship(teamData.championshipId)
          if (draws.length > 0) {
            setDraw(draws[0])
          }
        }
      }
    }
  }, [user])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inscricoes_abertas":
        return <Badge className="bg-primary/20 text-primary"><Clock className="w-3 h-3 mr-1" />Inscricoes Abertas</Badge>
      case "em_andamento":
        return <Badge className="bg-accent/20 text-accent"><CheckCircle className="w-3 h-3 mr-1" />Em Andamento</Badge>
      case "finalizado":
        return <Badge className="bg-muted text-muted-foreground">Finalizado</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground">Rascunho</Badge>
    }
  }

  if (!athlete || !team) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando competicoes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minhas Competicoes</h1>
        <p className="text-muted-foreground">
          Acompanhe as competicoes em que esta inscrito
        </p>
      </div>

      {championship ? (
        <>
          {/* Championship Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  {championship.name}
                </CardTitle>
                {getStatusBadge(championship.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Modalidade</p>
                  <p className="font-medium text-card-foreground">{championship.modality}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium text-card-foreground">{championship.category}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Periodo</p>
                  <p className="font-medium text-card-foreground">
                    {formatDate(championship.startDate)} - {formatDate(championship.endDate)}
                  </p>
                </div>
              </div>

              {championship.regulation && (
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium text-card-foreground mb-2">Regulamento</h4>
                  <p className="text-sm text-muted-foreground">{championship.regulation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Minha Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-card-foreground text-lg">{team.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {store.getAthletesByTeam(team.id).length} atletas cadastrados
                    </p>
                  </div>
                  <Badge
                    className={
                      team.status === "confirmada"
                        ? "bg-accent/20 text-accent"
                        : "bg-warning/20 text-warning-foreground"
                    }
                  >
                    {team.status === "confirmada" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {team.status === "confirmada" ? "Confirmada" : "Pendente"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Groups/Draw */}
          {draw && draw.validated && (
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Grupos do Campeonato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {draw.result.map((group) => {
                    const isMyGroup = group.teams.includes(team.name)
                    return (
                      <div
                        key={group.group}
                        className={`p-4 rounded-lg border ${
                          isMyGroup
                            ? "border-primary/50 bg-primary/5"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-card-foreground">Grupo {group.group}</h4>
                          {isMyGroup && (
                            <Badge className="bg-primary/20 text-primary text-xs">Meu grupo</Badge>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {group.teams.map((teamName, idx) => (
                            <li
                              key={idx}
                              className={`text-sm ${
                                teamName === team.name
                                  ? "font-medium text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {teamName}
                              {teamName === team.name && " (Minha equipe)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              Nenhuma competicao ativa
            </h3>
            <p className="text-muted-foreground">
              Voce nao esta inscrito em nenhuma competicao no momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
