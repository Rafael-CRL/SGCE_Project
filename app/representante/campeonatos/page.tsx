"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Championship, type Team } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Eye,
  UserPlus,
} from "lucide-react"

export default function RepresentativeChampionshipsPage() {
  const { user } = useAuth()
  const [championships, setChampionships] = useState<Championship[]>([])
  const [myTeams, setMyTeams] = useState<Team[]>([])

  useEffect(() => {
    setChampionships(store.getChampionships())
    if (user) {
      setMyTeams(store.getTeamsByRepresentative(user.id))
    }
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inscricoes_abertas":
        return <Badge className="bg-accent/20 text-accent"><CheckCircle className="w-3 h-3 mr-1" />Inscrições Abertas</Badge>
      case "em_andamento":
        return <Badge className="bg-primary/20 text-primary"><Clock className="w-3 h-3 mr-1" />Em Andamento</Badge>
      case "finalizado":
        return <Badge className="bg-muted text-muted-foreground">Finalizado</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground">Rascunho</Badge>
    }
  }

  const getMyTeamsInChampionship = (championshipId: string) => {
    return myTeams.filter(t => t.championshipId === championshipId)
  }

  const openChampionships = championships.filter(c => c.status === "inscricoes_abertas")
  const otherChampionships = championships.filter(c => c.status !== "inscricoes_abertas")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Campeonatos</h1>
        <p className="text-muted-foreground">
          Veja os campeonatos disponíveis e inscreva suas equipes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{championships.length}</p>
                <p className="text-sm text-muted-foreground">Total de Campeonatos</p>
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
                <p className="text-2xl font-bold text-card-foreground">{openChampionships.length}</p>
                <p className="text-sm text-muted-foreground">Com Inscrições Abertas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{myTeams.length}</p>
                <p className="text-sm text-muted-foreground">Minhas Equipes Inscritas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Open Championships */}
      {openChampionships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              Campeonatos com Inscrições Abertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {openChampionships.map((champ) => {
              const teamsInChamp = getMyTeamsInChampionship(champ.id)
              return (
                <div
                  key={champ.id}
                  className="p-4 rounded-lg border border-accent/30 bg-accent/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(champ.status)}
                      </div>
                      <h3 className="font-medium text-card-foreground text-lg">{champ.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {champ.modality} - {champ.category}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(champ.startDate).toLocaleDateString("pt-BR")} a {new Date(champ.endDate).toLocaleDateString("pt-BR")}
                        </span>
                        {champ.maxTeams && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Limite: {champ.maxTeams} equipes
                          </span>
                        )}
                      </div>
                      
                      {teamsInChamp.length > 0 && (
                        <div className="mt-3 p-2 rounded bg-background">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Minhas equipes neste campeonato:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {teamsInChamp.map(team => (
                              <Badge key={team.id} variant="outline" className="text-card-foreground">
                                {team.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/representante/equipes/nova?championshipId=${champ.id}`}>
                        <Button>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Inscrever Equipe
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Other Championships */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Outros Campeonatos</CardTitle>
        </CardHeader>
        <CardContent>
          {otherChampionships.length > 0 ? (
            <div className="space-y-4">
              {otherChampionships.map((champ) => {
                const teamsInChamp = getMyTeamsInChampionship(champ.id)
                return (
                  <div
                    key={champ.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(champ.status)}
                        </div>
                        <h3 className="font-medium text-card-foreground">{champ.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {champ.modality} - {champ.category}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(champ.startDate).toLocaleDateString("pt-BR")} a {new Date(champ.endDate).toLocaleDateString("pt-BR")}
                        </div>
                        
                        {teamsInChamp.length > 0 && (
                          <div className="mt-3 p-2 rounded bg-background">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Minhas equipes:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {teamsInChamp.map(team => (
                                <Badge key={team.id} variant="outline" className="text-card-foreground">
                                  {team.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum outro campeonato no momento</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
