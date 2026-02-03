"use client"

import React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { store, type Team } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Users } from "lucide-react"

function NewAthleteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [teams, setTeams] = useState<Team[]>([])
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    position: "",
    teamId: searchParams.get("teamId") || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setTeams(store.getTeamsByRepresentative(user.id))
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.birthDate || !formData.position || !formData.teamId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    store.addAthlete({
      name: formData.name.trim(),
      birthDate: formData.birthDate,
      position: formData.position,
      teamId: formData.teamId,
      photo: "/placeholder.svg?height=200&width=200",
      status: "pendente"
    })

    toast({
      title: "Atleta cadastrado!",
      description: "O atleta foi cadastrado e aguarda aprovação."
    })

    router.push("/representante/atletas")
  }

  const positions = [
    "Goleiro",
    "Zagueiro",
    "Lateral",
    "Volante",
    "Meio-campo",
    "Meia",
    "Atacante",
    "Ponta",
    "Centroavante"
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/representante/atletas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Atleta</h1>
          <p className="text-muted-foreground">
            Cadastre um novo atleta para sua equipe
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Dados do Atleta</CardTitle>
          <CardDescription>
            Preencha as informações do atleta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Nome do atleta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posição *</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Equipe *</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => setFormData({ ...formData, teamId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.teamId && (
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-card-foreground">
                    Equipe selecionada: {teams.find(t => t.id === formData.teamId)?.name}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/representante/atletas" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Salvando..." : "Cadastrar Atleta"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NewAthletePage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <NewAthleteForm />
    </Suspense>
  )
}
