"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { store } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

const modalities = [
  "Futebol",
  "Futsal",
  "Basquete",
  "Vôlei",
  "Handebol",
  "Atletismo",
]

const statuses = [
  { value: "rascunho", label: "Rascunho" },
  { value: "inscricoes_abertas", label: "Inscrições Abertas" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "finalizado", label: "Finalizado" },
]

export default function NewChampionshipPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    modality: "",
    category: "",
    startDate: "",
    endDate: "",
    maxTeams: "",
    status: "rascunho" as const,
    regulation: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const championship = store.addChampionship({
        name: formData.name,
        modality: formData.modality,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxTeams: formData.maxTeams ? parseInt(formData.maxTeams) : undefined,
        status: formData.status,
        regulation: formData.regulation,
      })

      toast({
        title: "Campeonato criado!",
        description: `O campeonato "${championship.name}" foi criado com sucesso.`,
      })

      router.push("/admin/campeonatos")
    } catch {
      toast({
        title: "Erro ao criar campeonato",
        description: "Ocorreu um erro ao criar o campeonato. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/campeonatos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Campeonato</h1>
          <p className="text-muted-foreground">Crie um novo campeonato esportivo</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Informações do Campeonato</CardTitle>
          <CardDescription>Preencha os dados do novo campeonato</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Campeonato *</Label>
              <Input
                id="name"
                placeholder="Ex: Campeonato Municipal Sub-17"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Modality */}
            <div className="space-y-2">
              <Label>Modalidade *</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {modalities.map((mod) => (
                  <Button
                    key={mod}
                    type="button"
                    variant={formData.modality === mod ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, modality: mod })}
                    className="w-full"
                  >
                    {mod}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                placeholder="Ex: Sub-17, Livre, Feminino"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Max Teams */}
            <div className="space-y-2">
              <Label htmlFor="maxTeams">Máximo de Equipes</Label>
              <Input
                id="maxTeams"
                type="number"
                placeholder="Ex: 12"
                value={formData.maxTeams}
                onChange={(e) => setFormData({ ...formData, maxTeams: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para ilimitado
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as typeof formData.status })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Regulation */}
            <div className="space-y-2">
              <Label htmlFor="regulation">Regulamento *</Label>
              <Textarea
                id="regulation"
                placeholder="Descreva o regulamento do campeonato..."
                value={formData.regulation}
                onChange={(e) => setFormData({ ...formData, regulation: e.target.value })}
                rows={5}
                required
              />
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Dica:</p>
                <p className="text-sm text-muted-foreground">
                  Após criar o campeonato, você poderá gerenciar as equipes inscritas,
                  realizar sorteios e acompanhar as partidas.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Link href="/admin/campeonatos">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading || !formData.modality}>
                {isLoading ? "Criando..." : "Criar Campeonato"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
