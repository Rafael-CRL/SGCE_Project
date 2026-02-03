"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { store, type Athlete, type Team, type Championship } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Calendar,
  CheckCircle,
  Download,
  Share2,
  QrCode,
  Shield,
} from "lucide-react"

export default function DigitalIDCardPage() {
  const { user } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [championship, setChampionship] = useState<Championship | null>(null)

  useEffect(() => {
    if (user?.athleteId) {
      const athleteData = store.getAthleteById(user.athleteId)
      if (athleteData) {
        setAthlete(athleteData)
        
        const teamData = store.getTeamById(athleteData.teamId)
        if (teamData) {
          setTeam(teamData)
          
          const champData = store.getChampionshipById(teamData.championshipId)
          setChampionship(champData || null)
        }
      }
    }
  }, [user])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (!athlete || !team) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando carteirinha...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minha Carteirinha Digital</h1>
        <p className="text-muted-foreground">
          Sua identificação oficial como atleta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital ID Card */}
        <div className="space-y-4">
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-1"
          >
            <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">SGCE</h3>
                    <p className="text-xs text-white/70">Carteira de Atleta</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      athlete.status === "ativo"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }
                  >
                    {athlete.status === "ativo" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {athlete.status === "ativo" ? "ATIVO" : "PENDENTE"}
                  </Badge>
                </div>
              </div>

              {/* Athlete Info */}
              <div className="flex gap-4">
                <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-white/30 bg-white/10">
                  <Image
                    src={athlete.photo || "/placeholder.svg"}
                    alt={athlete.name}
                    width={96}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wide">Nome</p>
                    <p className="font-bold text-lg text-white">{athlete.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">Nascimento</p>
                      <p className="text-sm text-white">{formatDate(athlete.birthDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">Idade</p>
                      <p className="text-sm text-white">{calculateAge(athlete.birthDate)} anos</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wide">Posicao</p>
                    <p className="text-sm text-white">{athlete.position}</p>
                  </div>
                </div>
              </div>

              {/* Team Info */}
              <div className="mt-4 p-3 rounded-lg bg-white/10 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wide">Equipe</p>
                    <p className="font-medium text-white">{team.name}</p>
                  </div>
                  {championship && (
                    <div className="text-right">
                      <p className="text-xs text-white/60 uppercase tracking-wide">Campeonato</p>
                      <p className="text-sm text-white">{championship.category}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-12 h-12 text-white/50" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60">ID: {athlete.id.toUpperCase()}</p>
                  <p className="text-xs text-white/60">
                    Valido ate: {championship ? formatDate(championship.endDate) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Informacoes do Atleta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium text-card-foreground">{athlete.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium text-card-foreground">{formatDate(athlete.birthDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Idade</p>
                  <p className="font-medium text-card-foreground">{calculateAge(athlete.birthDate)} anos</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posicao</p>
                  <p className="font-medium text-card-foreground">{athlete.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      athlete.status === "ativo"
                        ? "bg-accent/20 text-accent"
                        : "bg-warning/20 text-warning-foreground"
                    }
                  >
                    {athlete.status === "ativo" ? "Ativo" : "Pendente"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID do Atleta</p>
                  <p className="font-mono text-sm text-card-foreground">{athlete.id.toUpperCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Informacoes da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Equipe</p>
                  <p className="font-medium text-card-foreground">{team.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status da Equipe</p>
                  <Badge
                    className={
                      team.status === "confirmada"
                        ? "bg-accent/20 text-accent"
                        : "bg-warning/20 text-warning-foreground"
                    }
                  >
                    {team.status === "confirmada" ? "Confirmada" : "Pendente"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {championship && (
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Competicao
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Campeonato</p>
                    <p className="font-medium text-card-foreground">{championship.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Modalidade</p>
                    <p className="font-medium text-card-foreground">{championship.modality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium text-card-foreground">{championship.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Periodo</p>
                    <p className="font-medium text-card-foreground">
                      {formatDate(championship.startDate)} - {formatDate(championship.endDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Documento Oficial</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta carteirinha digital e sua identificacao oficial como atleta inscrito.
                  Apresente-a quando solicitado durante as competicoes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
