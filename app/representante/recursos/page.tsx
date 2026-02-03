"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Appeal, type Team } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function RepresentativeAppealsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null)

  useEffect(() => {
    if (user) {
      const userTeams = store.getTeamsByRepresentative(user.id)
      setTeams(userTeams)
      
      const teamAppeals = userTeams.flatMap(team => store.getAppealsByTeam(team.id))
      setAppeals(teamAppeals)
    }
  }, [user])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge className="bg-warning/20 text-warning-foreground"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      case "deferido":
        return <Badge className="bg-accent/20 text-accent"><CheckCircle className="w-3 h-3 mr-1" />Deferido</Badge>
      case "indeferido":
        return <Badge className="bg-destructive/20 text-destructive"><XCircle className="w-3 h-3 mr-1" />Indeferido</Badge>
      default:
        return null
    }
  }

  const pendingAppeals = appeals.filter(a => a.status === "pendente")
  const decidedAppeals = appeals.filter(a => a.status !== "pendente")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recursos</h1>
          <p className="text-muted-foreground">
            Acompanhe e abra novos recursos
          </p>
        </div>
        <Link href="/representante/recursos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Recurso
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{appeals.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
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
                <p className="text-2xl font-bold text-card-foreground">{pendingAppeals.length}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
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
                  {appeals.filter(a => a.status === "deferido").length}
                </p>
                <p className="text-sm text-muted-foreground">Deferidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {appeals.filter(a => a.status === "indeferido").length}
                </p>
                <p className="text-sm text-muted-foreground">Indeferidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Appeals */}
      {pendingAppeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning-foreground" />
              Recursos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAppeals.map((appeal) => {
              const team = teams.find(t => t.id === appeal.teamId)
              const championship = store.getChampionshipById(appeal.championshipId)
              return (
                <div
                  key={appeal.id}
                  className="p-4 rounded-lg border border-warning/30 bg-warning/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(appeal.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(appeal.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-medium text-card-foreground">{appeal.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {team?.name} - {championship?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {appeal.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAppeal(appeal)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Decided Appeals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Histórico de Recursos</CardTitle>
        </CardHeader>
        <CardContent>
          {decidedAppeals.length > 0 ? (
            <div className="space-y-4">
              {decidedAppeals.map((appeal) => {
                const team = teams.find(t => t.id === appeal.teamId)
                const championship = store.getChampionshipById(appeal.championshipId)
                return (
                  <div
                    key={appeal.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(appeal.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(appeal.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-medium text-card-foreground">{appeal.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {team?.name} - {championship?.name}
                        </p>
                        {appeal.opinion && (
                          <div className="mt-3 p-3 rounded bg-background border border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Parecer:
                            </p>
                            <p className="text-sm text-card-foreground">{appeal.opinion}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppeal(appeal)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                Nenhum recurso processado
              </h3>
              <p className="text-muted-foreground mb-4">
                Seus recursos decididos aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!selectedAppeal} onOpenChange={() => setSelectedAppeal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Recurso</DialogTitle>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedAppeal.status)}
                <span className="text-sm text-muted-foreground">
                  {formatDate(selectedAppeal.createdAt)}
                </span>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium text-card-foreground mb-2">
                  {selectedAppeal.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAppeal.description}
                </p>
              </div>
              
              {selectedAppeal.opinion && (
                <div className="p-4 rounded-lg border border-border bg-background">
                  <p className="text-sm font-medium text-card-foreground mb-2">Parecer:</p>
                  <p className="text-sm text-muted-foreground">{selectedAppeal.opinion}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Decidido por {selectedAppeal.decidedBy} em {formatDate(selectedAppeal.decidedAt!)}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppeal(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
