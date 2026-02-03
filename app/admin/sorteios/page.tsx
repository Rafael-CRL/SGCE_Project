"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Draw } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Shuffle,
  CheckCircle,
  Clock,
  Eye,
  Check,
} from "lucide-react"

export default function DrawsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [draws, setDraws] = useState<Draw[]>([])

  useEffect(() => {
    setDraws(store.getDraws())
  }, [])

  const handleValidate = (drawId: string) => {
    if (!user) return
    
    const updated = store.validateDraw(drawId, user.name)
    if (updated) {
      setDraws(store.getDraws())
      toast({
        title: "Sorteio validado!",
        description: "O sorteio foi validado com sucesso.",
      })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const validatedDraws = draws.filter((d) => d.validated)
  const pendingDraws = draws.filter((d) => !d.validated)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sorteios</h1>
          <p className="text-muted-foreground">
            Gerencie os sorteios de grupos e chaves
          </p>
        </div>
        <Link href="/admin/sorteios/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Sorteio
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shuffle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{draws.length}</p>
                <p className="text-sm text-muted-foreground">Total de Sorteios</p>
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
                <p className="text-2xl font-bold text-card-foreground">{validatedDraws.length}</p>
                <p className="text-sm text-muted-foreground">Validados</p>
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
                <p className="text-2xl font-bold text-card-foreground">{pendingDraws.length}</p>
                <p className="text-sm text-muted-foreground">Aguardando Validação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Draws */}
      {pendingDraws.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-chart-3" />
              Sorteios Pendentes de Validação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingDraws.map((draw) => {
              const championship = store.getChampionshipById(draw.championshipId)
              return (
                <div
                  key={draw.id}
                  className="p-4 rounded-lg border border-chart-3/30 bg-chart-3/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-card-foreground">
                        {draw.modality} - {draw.category}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {championship?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {draw.groups} grupos • Executado por {draw.executedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(draw.executedAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/sorteios/${draw.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      <Button size="sm" onClick={() => handleValidate(draw.id)}>
                        <Check className="w-4 h-4 mr-1" />
                        Validar
                      </Button>
                    </div>
                  </div>

                  {/* Groups Preview */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {draw.result.map((group) => (
                      <div
                        key={group.group}
                        className="p-2 rounded bg-background text-center"
                      >
                        <p className="text-xs font-medium text-muted-foreground">
                          Grupo {group.group}
                        </p>
                        <p className="text-sm text-card-foreground">{group.teams.length} equipes</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Validated Draws */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            Sorteios Validados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validatedDraws.length > 0 ? (
            <div className="space-y-4">
              {validatedDraws.map((draw) => {
                const championship = store.getChampionshipById(draw.championshipId)
                return (
                  <div
                    key={draw.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-card-foreground">
                            {draw.modality} - {draw.category}
                          </h3>
                          <Badge className="bg-accent/20 text-accent">Validado</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {championship?.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {draw.groups} grupos • Executado por {draw.executedBy}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(draw.executedAt)}
                        </p>
                        {draw.validatedBy && (
                          <p className="text-xs text-accent mt-1">
                            Validado por {draw.validatedBy} em {formatDate(draw.validatedAt!)}
                          </p>
                        )}
                      </div>
                      <Link href={`/admin/sorteios/${draw.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>

                    {/* Groups */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {draw.result.map((group) => (
                        <div
                          key={group.group}
                          className="p-3 rounded-lg bg-background border border-border"
                        >
                          <p className="text-sm font-medium text-card-foreground mb-2">
                            Grupo {group.group}
                          </p>
                          <ul className="space-y-1">
                            {group.teams.map((team, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">
                                {team}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shuffle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground">
                Nenhum sorteio validado
              </h3>
              <p className="text-muted-foreground mb-4">
                Realize e valide sorteios para vê-los aqui.
              </p>
              <Link href="/admin/sorteios/novo">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Sorteio
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
