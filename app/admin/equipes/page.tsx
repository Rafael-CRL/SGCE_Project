"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Team } from "@/lib/store"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Users, Eye, Edit } from "lucide-react"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [championships, setChampionships] = useState(store.getChampionships())
  const [search, setSearch] = useState("")
  const [championshipFilter, setChampionshipFilter] = useState("all")

  useEffect(() => {
    setTeams(store.getTeams())
    setChampionships(store.getChampionships())
  }, [])

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase())
    const matchesChampionship =
      championshipFilter === "all" || team.championshipId === championshipFilter
    return matchesSearch && matchesChampionship
  })

  const getStatusBadge = (status: Team["status"]) => {
    switch (status) {
      case "confirmada":
        return (
          <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
            Confirmada
          </Badge>
        )
      case "inscrita":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            Inscrita
          </Badge>
        )
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>
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
          <h1 className="text-2xl font-bold text-foreground">Equipes</h1>
          <p className="text-muted-foreground">
            Gerencie todas as equipes cadastradas no sistema
          </p>
        </div>
        <Link href="/admin/equipes/nova">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Equipe
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Total de Equipes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {teams.filter((t) => t.status === "confirmada").length}
                </p>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
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
                <p className="text-2xl font-bold text-card-foreground">
                  {teams.filter((t) => t.status === "inscrita").length}
                </p>
                <p className="text-sm text-muted-foreground">Aguardando Confirmação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar equipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={championshipFilter} onValueChange={setChampionshipFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filtrar por campeonato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Campeonatos</SelectItem>
                {championships.map((champ) => (
                  <SelectItem key={champ.id} value={champ.id}>
                    {champ.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Lista de Equipes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipe</TableHead>
                <TableHead>Campeonato</TableHead>
                <TableHead>Atletas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Inscrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => {
                const championship = store.getChampionshipById(team.championshipId)
                const athletes = store.getAthletesByTeam(team.id)
                return (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-card-foreground">{team.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {championship?.name || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{athletes.length}</TableCell>
                    <TableCell>{getStatusBadge(team.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(team.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/equipes/${team.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/equipes/${team.id}/editar`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredTeams.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground">
                Nenhuma equipe encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || championshipFilter !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Comece cadastrando uma nova equipe."}
              </p>
              <Link href="/admin/equipes/nova">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Equipe
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
