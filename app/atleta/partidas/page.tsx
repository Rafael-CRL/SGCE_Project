"use client"

import { useEffect, useState } from "react"
import { store, type Athlete, type Team, type Match } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  CheckCircle,
} from "lucide-react"

export default function AthleteMatchesPage() {
  const { user } = useAuth()
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    if (user?.athleteId) {
      const athleteData = store.getAthleteById(user.athleteId)
      if (athleteData) {
        setAthlete(athleteData)
        
        const teamData = store.getTeamById(athleteData.teamId)
        if (teamData) {
          setTeam(teamData)
          
          const allMatches = store.getMatchesByChampionship(teamData.championshipId)
            .filter(m => m.homeTeamId === teamData.id || m.awayTeamId === teamData.id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setMatches(allMatches)
        }
      }
    }
  }, [user])

  const upcomingMatches = matches.filter(m => m.status === "agendada")
  const pastMatches = matches.filter(m => m.status === "finalizada")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    })
  }

  if (!athlete || !team) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando partidas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minhas Partidas</h1>
        <p className="text-muted-foreground">
          Acompanhe as partidas da sua equipe - {team.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{matches.length}</p>
                <p className="text-sm text-muted-foreground">Total de Partidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{upcomingMatches.length}</p>
                <p className="text-sm text-muted-foreground">Proximas</p>
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
                <p className="text-2xl font-bold text-card-foreground">{pastMatches.length}</p>
                <p className="text-sm text-muted-foreground">Realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-chart-3" />
              Proximas Partidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMatches.map((match) => {
              const homeTeam = store.getTeamById(match.homeTeamId)
              const awayTeam = store.getTeamById(match.awayTeamId)
              const isHome = match.homeTeamId === team.id
              
              return (
                <div
                  key={match.id}
                  className="p-4 rounded-lg border border-chart-3/30 bg-chart-3/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-card-foreground">{match.round}</Badge>
                    <Badge className={isHome ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}>
                      {isHome ? "Casa" : "Fora"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center flex-1">
                      <p className={`font-bold text-lg ${match.homeTeamId === team.id ? "text-primary" : "text-card-foreground"}`}>
                        {homeTeam?.name}
                      </p>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-background">
                      <p className="text-xl font-bold text-muted-foreground">VS</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className={`font-bold text-lg ${match.awayTeamId === team.id ? "text-primary" : "text-card-foreground"}`}>
                        {awayTeam?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground border-t border-border pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(match.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {match.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {match.location}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Past Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Partidas Realizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastMatches.length > 0 ? (
            <div className="space-y-4">
              {pastMatches.map((match) => {
                const homeTeam = store.getTeamById(match.homeTeamId)
                const awayTeam = store.getTeamById(match.awayTeamId)
                const isHome = match.homeTeamId === team.id
                const won = (isHome && (match.homeScore || 0) > (match.awayScore || 0)) ||
                           (!isHome && (match.awayScore || 0) > (match.homeScore || 0))
                const draw = match.homeScore === match.awayScore
                
                return (
                  <div
                    key={match.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-card-foreground">{match.round}</Badge>
                      <Badge
                        className={
                          won ? "bg-accent/20 text-accent" :
                          draw ? "bg-muted text-muted-foreground" :
                          "bg-destructive/20 text-destructive"
                        }
                      >
                        {won ? "Vitoria" : draw ? "Empate" : "Derrota"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 py-4">
                      <div className="text-center flex-1">
                        <p className={`font-bold text-lg ${match.homeTeamId === team.id ? "text-primary" : "text-card-foreground"}`}>
                          {homeTeam?.name}
                        </p>
                      </div>
                      <div className="px-6 py-3 rounded-lg bg-background border border-border">
                        <p className="text-2xl font-bold text-card-foreground">
                          {match.homeScore} - {match.awayScore}
                        </p>
                      </div>
                      <div className="text-center flex-1">
                        <p className={`font-bold text-lg ${match.awayTeamId === team.id ? "text-primary" : "text-card-foreground"}`}>
                          {awayTeam?.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground border-t border-border pt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(match.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.location}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma partida realizada ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
