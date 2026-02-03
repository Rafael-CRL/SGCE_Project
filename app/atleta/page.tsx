"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { store, type Athlete, type Team, type Championship, type Match } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
} from "lucide-react"

export default function AthleteHomePage() {
  const { user } = useAuth()
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [championship, setChampionship] = useState<Championship | null>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])

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
          
          // Get upcoming matches for the team
          const matches = store.getMatchesByChampionship(teamData.championshipId)
            .filter(m => 
              m.status === "agendada" && 
              (m.homeTeamId === teamData.id || m.awayTeamId === teamData.id)
            )
            .slice(0, 3)
          setUpcomingMatches(matches)
        }
      }
    }
  }, [user])

  if (!athlete || !team) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando dados do atleta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bem-vindo, {athlete.name}
        </h1>
        <p className="text-muted-foreground">
          Portal do Atleta - Acompanhe suas informações e competições
        </p>
      </div>

      {/* Quick Profile Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/30 bg-background">
              <Image
                src={athlete.photo || "/placeholder.svg"}
                alt={athlete.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-card-foreground">{athlete.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-primary/20 text-primary">{athlete.position}</Badge>
                <Badge
                  className={
                    athlete.status === "ativo"
                      ? "bg-accent/20 text-accent"
                      : "bg-warning/20 text-warning-foreground"
                  }
                >
                  {athlete.status === "ativo" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {athlete.status === "ativo" ? "Ativo" : "Pendente"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {team.name}
                </span>
                {championship && (
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {championship.name}
                  </span>
                )}
              </div>
            </div>
            <Link href="/atleta/carteirinha">
              <Button>
                <CreditCard className="w-4 h-4 mr-2" />
                Ver Carteirinha
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">1</p>
                <p className="text-sm text-muted-foreground">Campeonato Ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{upcomingMatches.length}</p>
                <p className="text-sm text-muted-foreground">Próximas Partidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground capitalize">{athlete.status}</p>
                <p className="text-sm text-muted-foreground">Status de Inscrição</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Matches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">Próximas Partidas</CardTitle>
          <Link href="/atleta/partidas">
            <Button variant="outline" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingMatches.length > 0 ? (
            <div className="space-y-4">
              {upcomingMatches.map((match) => {
                const homeTeam = store.getTeamById(match.homeTeamId)
                const awayTeam = store.getTeamById(match.awayTeamId)
                const isHome = match.homeTeamId === team.id
                
                return (
                  <div
                    key={match.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 text-card-foreground">{match.round}</Badge>
                        <h3 className="font-medium text-card-foreground">
                          {homeTeam?.name} vs {awayTeam?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isHome ? "Jogo em casa" : "Jogo fora"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(match.date).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          {match.time}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {match.location}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma partida agendada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competition Info */}
      {championship && (
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Minha Competição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground text-lg">{championship.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {championship.modality} - {championship.category}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(championship.startDate).toLocaleDateString("pt-BR")} a{" "}
                      {new Date(championship.endDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    championship.status === "em_andamento"
                      ? "bg-accent/20 text-accent"
                      : championship.status === "inscricoes_abertas"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {championship.status === "em_andamento" && "Em Andamento"}
                  {championship.status === "inscricoes_abertas" && "Inscrições Abertas"}
                  {championship.status === "finalizado" && "Finalizado"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
