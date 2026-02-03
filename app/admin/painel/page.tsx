"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type ActivityLog } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Flag,
  Users,
  UserCircle,
  FileText,
  Calendar,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  XCircle,
  Shuffle,
  ArrowRight,
} from "lucide-react"

export default function AdminPanelPage() {
  const [stats, setStats] = useState(store.getStatistics())
  const [logs, setLogs] = useState<ActivityLog[]>(store.getActivityLogs())
  const [appeals, setAppeals] = useState(store.getAppeals())
  const [draws, setDraws] = useState(store.getDraws())

  useEffect(() => {
    setStats(store.getStatistics())
    setLogs(store.getActivityLogs())
    setAppeals(store.getAppeals())
    setDraws(store.getDraws())
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case "recurso":
        return <FileText className="w-4 h-4" />
      case "sorteio":
        return <Shuffle className="w-4 h-4" />
      case "equipe":
        return <Users className="w-4 h-4" />
      case "atleta":
        return <UserCircle className="w-4 h-4" />
      case "campeonato":
        return <Flag className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  const pendingAppeals = appeals.filter((a) => a.status === "pendente")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel do Organizador</h1>
        <p className="text-muted-foreground">
          Visão consolidada e controle do sistema
        </p>
      </div>

      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Flag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.totalChampionships}</p>
                <p className="text-sm text-muted-foreground">Campeonatos</p>
                <p className="text-xs text-muted-foreground">
                  {stats.openChampionships} abertos • 0 em andamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.totalTeams}</p>
                <p className="text-sm text-muted-foreground">Equipes</p>
                <p className="text-xs text-muted-foreground">
                  {stats.totalTeams} inscrições em campeonatos
                </p>
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
                <p className="text-sm text-muted-foreground">Atletas</p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeAthletes} ativos • {stats.pendingAthletes} pendente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{appeals.length}</p>
                <p className="text-sm text-muted-foreground">Recursos</p>
                <p className="text-xs text-muted-foreground">{stats.pendingAppeals} pendente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.totalMatches}</p>
                <p className="text-sm text-muted-foreground">Partidas Cadastradas</p>
                <p className="text-xs text-muted-foreground">
                  {stats.scheduledMatches} agendadas • {stats.finishedMatches} finalizadas
                </p>
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
                <p className="text-2xl font-bold text-card-foreground">{stats.finishedMatches}</p>
                <p className="text-sm text-muted-foreground">Resultados Registrados</p>
                <p className="text-xs text-muted-foreground">{stats.totalGoals} gols marcados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {stats.avgGoalsPerMatch.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Média de Gols/Jogo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Draw Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-card-foreground">Status dos Sorteios</CardTitle>
            <span className="text-sm text-muted-foreground">
              {draws.length} sorteio realizado
            </span>
            <Link href="/admin/sorteios">
              <Button variant="ghost" size="sm" className="text-primary">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-card-foreground">Validados</p>
                  <p className="text-sm text-muted-foreground">Aprovados e auditados</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-card-foreground">{stats.validatedDraws}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-chart-3" />
                <div>
                  <p className="font-medium text-card-foreground">Pendentes de Validação</p>
                  <p className="text-sm text-muted-foreground">Aguardando aprovação</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-card-foreground">{stats.pendingDraws}</span>
            </div>
          </CardContent>
        </Card>

        {/* Appeals Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-card-foreground">Gestão de Recursos</CardTitle>
            <span className="text-sm text-muted-foreground">Histórico e pendências</span>
            <Link href="/admin/recursos">
              <Button variant="ghost" size="sm" className="text-primary">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-destructive/10">
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xs text-muted-foreground">Aguardando análise</p>
                <p className="text-xl font-bold text-destructive">{stats.pendingAppeals}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-sm text-muted-foreground">Deferidos</p>
                <p className="text-xl font-bold text-accent">{stats.approvedAppeals}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Indeferidos</p>
                <p className="text-xl font-bold text-card-foreground">{stats.rejectedAppeals}</p>
              </div>
            </div>

            {pendingAppeals.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-medium text-card-foreground mb-2">Recursos Pendentes</p>
                {pendingAppeals.slice(0, 1).map((appeal) => {
                  const team = store.getTeamById(appeal.teamId)
                  return (
                    <div
                      key={appeal.id}
                      className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                    >
                      <p className="font-medium text-card-foreground text-sm">{appeal.title}</p>
                      <p className="text-xs text-muted-foreground">{team?.name}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-card-foreground">Histórico de Ações</CardTitle>
          <p className="text-sm text-muted-foreground">Atividades recentes no sistema</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground text-sm">{log.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.userName} • {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/campeonatos">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Gerenciar Campeonatos</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.openChampionships} com inscrições abertas
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sorteios">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shuffle className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Validar Sorteios</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingDraws} aguardando validação
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/recursos">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Analisar Recursos</p>
                  <p className="text-sm text-muted-foreground">{stats.pendingAppeals} pendente</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
