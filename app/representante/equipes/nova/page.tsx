"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { store, type Championship } from "@/lib/store"
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
import { ArrowLeft, Save, Trophy, Calendar } from "lucide-react"

export default function NewTeamPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [championships, setChampionships] = useState<Championship[]>([])
  const [formData, setFormData] = useState({
    name: "",
    championshipId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Get championships with open registrations
    const openChamps = store.getChampionships().filter(c => c.status === "inscricoes_abertas")
    setChampionships(openChamps)
  }, [])

  const selectedChamp = championships.find(c => c.id === formData.championshipId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    if (!formData.name.trim() || !formData.championshipId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    store.addTeam({
      name: formData.name.trim(),
      championshipId: formData.championshipId,
      representativeId: user.id,
      status: "inscrita"
    })

    toast({
      title: "Equipe inscrita!",
      description: "Sua equipe foi inscrita no campeonato com sucesso."
    })

    router.push("/representante/equipes")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/representante/equipes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nova Equipe</h1>
          <p className="text-muted-foreground">
            Inscreva sua equipe em um campeonato
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Dados da Equipe</CardTitle>
          <CardDescription>
            Preencha as informações da sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe *</Label>
              <Input
                id="name"
                placeholder="Ex: Tigres FC"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato *</Label>
              <Select
                value={formData.championshipId}
                onValueChange={(value) => setFormData({ ...formData, championshipId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campeonato" />
                </SelectTrigger>
                <SelectContent>
                  {championships.map((champ) => (
                    <SelectItem key={champ.id} value={champ.id}>
                      {champ.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedChamp && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="font-medium text-card-foreground">
                    {selectedChamp.modality} - {selectedChamp.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(selectedChamp.startDate).toLocaleDateString("pt-BR")} a{" "}
                    {new Date(selectedChamp.endDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {selectedChamp.maxTeams && (
                  <p className="text-sm text-muted-foreground">
                    Limite: {selectedChamp.maxTeams} equipes
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/representante/equipes" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Salvando..." : "Inscrever Equipe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
