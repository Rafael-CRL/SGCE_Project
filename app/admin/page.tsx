"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserCircle,
  Shuffle,
  FileText,
  Plus,
  Calendar,
  ArrowRight,
  Table2,
  BarChart3,
  Clock,
} from "lucide-react"

export default function AdminHomePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(store.getStatistics())
  const [draws, setDraws] = useState(store.getDraws())
  const [matches, setMatches] = useState(store.getMatches())
  const [appeals, setAppeals] = useState(store.getAppeals())

  useEffect(() => {
    setStats(store.getStatistics())
    setDraws(store.getDraws())
    setMatches(store.getMatches())
    setAppeals(store.getAppeals())
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const upcomingMatches = matches
    .filter((m) => m.status === "agendada")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2)

  const pendingAppeals = appeals.filter((a) => a.status === "pendente").slice(0, 1)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de gestão de competições esportivas
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
                <p className="text-2xl font-bold text-card-foreground">{stats.totalTeams}</p>
                <p className="text-sm text-muted-foreground">Equipes Cadastradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.totalAthletes}</p>
                <p className="text-sm text-muted-foreground">Atletas Registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Shuffle className="w-6 h-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.validatedDraws}</p>
                <p className="text-sm text-muted-foreground">Sorteios Realizados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.pendingAppeals}</p>
                <p className="text-sm text-muted-foreground">Recursos Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-card-foreground">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin/equipes/nova">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Nova Equipe</span>
              </Button>
            </Link>

            <Link href="/admin/atletas/novo">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">Novo Atleta</span>
              </Button>
            </Link>

            <Link href="/admin/sorteios/novo">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Shuffle className="w-5 h-5 text-chart-3" />
                </div>
                <span className="text-sm font-medium text-foreground">Realizar Sorteio</span>
              </Button>
            </Link>

            <Link href="/admin/recursos/novo">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-destructive" />
                </div>
                <span className="text-sm font-medium text-foreground">Novo Recurso</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Draws */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-card-foreground">Sorteios Recentes</CardTitle>
            <Link href="/admin/sorteios">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {draws.length > 0 ? (
              <div className="space-y-3">
                {draws.slice(0, 2).map((draw) => (
                  <div
                    key={draw.id}
                    className="p-3 rounded-lg bg-muted/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-card-foreground">
                        {draw.modality} - {draw.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {draw.groups} grupos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Por {draw.executedBy} • {formatDate(draw.executedAt)}
                      </p>
                    </div>
                    {draw.validated && (
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        Validado
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum sorteio realizado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Matches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-card-foreground">Próximas Partidas</CardTitle>
            <Link href="/admin/partidas">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length > 0 ? (
              <div className="space-y-3">
                {upcomingMatches.map((match) => {
                  const homeTeam = store.getTeamById(match.homeTeamId)
                  const awayTeam = store.getTeamById(match.awayTeamId)
                  return (
                    <div
                      key={match.id}
                      className="p-3 rounded-lg bg-muted/50"
                    >
                      <p className="font-medium text-card-foreground">
                        {homeTeam?.name} vs {awayTeam?.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(match.date)} • {match.time} • {match.location}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma partida agendada
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/classificacao">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Table2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Classificação</p>
                  <p className="text-sm text-muted-foreground">
                    Veja a tabela de posições dos campeonatos
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/partidas">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Calendário</p>
                  <p className="text-sm text-muted-foreground">
                    Confira as partidas agendadas e resultados
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/estatisticas">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Estatísticas</p>
                  <p className="text-sm text-muted-foreground">
                    Análise de dados e métricas do sistema
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Pending Appeals */}
      {pendingAppeals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-card-foreground">Recursos Pendentes</CardTitle>
            <Link href="/admin/recursos">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAppeals.map((appeal) => {
                const team = store.getTeamById(appeal.teamId)
                return (
                  <div
                    key={appeal.id}
                    className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">{appeal.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {team?.name} • {formatDate(appeal.createdAt)}
                        </p>
                      </div>
                      <Link href={`/admin/recursos/${appeal.id}`}>
                        <Button size="sm" variant="outline">
                          Analisar
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="font-medium text-card-foreground">Painel do Organizador</p>
          <p className="text-sm text-muted-foreground">
            Você tem acesso total ao sistema. Pode gerenciar equipes, atletas,
            competições, realizar sorteios e responder recursos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
