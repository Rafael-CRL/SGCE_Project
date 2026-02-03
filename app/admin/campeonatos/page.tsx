"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Championship } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Flag,
  Calendar,
  Users,
  Eye,
  Edit,
} from "lucide-react"

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    setChampionships(store.getChampionships())
  }, [])

  const filteredChampionships = championships.filter((champ) => {
    const matchesSearch =
      champ.name.toLowerCase().includes(search.toLowerCase()) ||
      champ.modality.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || champ.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Championship["status"]) => {
    switch (status) {
      case "inscricoes_abertas":
        return (
          <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
            Inscrições Abertas
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            Em Andamento
          </Badge>
        )
      case "finalizado":
        return (
          <Badge variant="secondary">Finalizado</Badge>
        )
      case "rascunho":
        return (
          <Badge variant="outline">Rascunho</Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campeonatos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os campeonatos esportivos
          </p>
        </div>
        <Link href="/admin/campeonatos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Campeonato
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou modalidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
                <SelectItem value="inscricoes_abertas">Inscrições Abertas</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Championships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChampionships.map((championship) => {
          const teams = store.getTeamsByChampionship(championship.id)
          return (
            <Card key={championship.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Flag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-card-foreground">{championship.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {championship.modality} • {championship.category}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {getStatusBadge(championship.status)}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(championship.startDate)} - {formatDate(championship.endDate)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {teams.length} equipes inscritas
                    {championship.maxTeams && ` / ${championship.maxTeams} vagas`}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/campeonatos/${championship.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </Button>
                  </Link>
                  <Link href={`/admin/campeonatos/${championship.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredChampionships.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground">
              Nenhum campeonato encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {search || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca."
                : "Comece criando um novo campeonato."}
            </p>
            <Link href="/admin/campeonatos/novo">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Campeonato
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
