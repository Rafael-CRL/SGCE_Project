"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, type Athlete } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Plus, Search, UserCircle, Eye, Edit } from "lucide-react"

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [teams, setTeams] = useState(store.getTeams())
  const [search, setSearch] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    setAthletes(store.getAthletes())
    setTeams(store.getTeams())
  }, [])

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch =
      athlete.name.toLowerCase().includes(search.toLowerCase()) ||
      athlete.position.toLowerCase().includes(search.toLowerCase())
    const matchesTeam = teamFilter === "all" || athlete.teamId === teamFilter
    const matchesStatus =
      statusFilter === "all" || athlete.status === statusFilter
    return matchesSearch && matchesTeam && matchesStatus
  })

  const getStatusBadge = (status: Athlete["status"]) => {
    switch (status) {
      case "ativo":
        return (
          <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
            Ativo
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Atletas</h1>
          <p className="text-muted-foreground">
            Gerencie todos os atletas cadastrados no sistema
          </p>
        </div>
        <Link href="/admin/atletas/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Atleta
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{athletes.length}</p>
                <p className="text-sm text-muted-foreground">Total de Atletas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {athletes.filter((a) => a.status === "ativo").length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {athletes.filter((a) => a.status === "pendente").length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
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
                placeholder="Buscar por nome ou posição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Equipes</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Lista de Atletas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atleta</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAthletes.map((athlete) => {
                const team = store.getTeamById(athlete.teamId)
                return (
                  <TableRow key={athlete.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={athlete.photo || "/placeholder.svg"} alt={athlete.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(athlete.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-card-foreground">{athlete.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {team?.name || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {athlete.position}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(athlete.birthDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(athlete.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/atletas/${athlete.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/atletas/${athlete.id}/editar`}>
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

          {filteredAthletes.length === 0 && (
            <div className="text-center py-8">
              <UserCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground">
                Nenhum atleta encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || teamFilter !== "all" || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Comece cadastrando um novo atleta."}
              </p>
              <Link href="/admin/atletas/novo">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Atleta
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
