"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { store, type Team, type Championship } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
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
import { ArrowLeft, Send, Users, Trophy } from "lucide-react"

export default function NewAppealPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [teams, setTeams] = useState<Team[]>([])
  const [formData, setFormData] = useState({
    teamId: "",
    title: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setTeams(store.getTeamsByRepresentative(user.id))
    }
  }, [user])

  const selectedTeam = teams.find(t => t.id === formData.teamId)
  const championship = selectedTeam ? store.getChampionshipById(selectedTeam.championshipId) : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !selectedTeam) return
    
    if (!formData.teamId || !formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    store.addAppeal({
      teamId: formData.teamId,
      championshipId: selectedTeam.championshipId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      createdBy: user.name,
    })

    toast({
      title: "Recurso enviado!",
      description: "Seu recurso foi registrado e será analisado."
    })

    router.push("/representante/recursos")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/representante/recursos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Recurso</h1>
          <p className="text-muted-foreground">
            Abra um recurso ou contestação
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Dados do Recurso</CardTitle>
          <CardDescription>
            Descreva detalhadamente a situação a ser analisada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {selectedTeam && championship && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    {selectedTeam.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>{championship.name}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título do Recurso *</Label>
              <Input
                id="title"
                placeholder="Ex: Contestação de resultado - Jogo 15"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada *</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente a situação, incluindo datas, fatos relevantes e o pedido..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Seja claro e objetivo. Inclua todas as informações relevantes para análise.
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/representante/recursos" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar Recurso"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
