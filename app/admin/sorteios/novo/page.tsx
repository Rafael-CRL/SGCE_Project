"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { store, type Championship, type Team } from "@/lib/store"
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
import { ArrowLeft, Shuffle, Users, Trophy, Check } from "lucide-react"

export default function NewDrawPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<string>("")
  const [teams, setTeams] = useState<Team[]>([])
  const [numberOfGroups, setNumberOfGroups] = useState(2)
  const [drawResult, setDrawResult] = useState<{ group: string; teams: string[] }[] | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    setChampionships(store.getChampionships())
  }, [])

  useEffect(() => {
    if (selectedChampionship) {
      const champTeams = store.getTeamsByChampionship(selectedChampionship)
      setTeams(champTeams)
      setDrawResult(null)
    }
  }, [selectedChampionship])

  const selectedChamp = championships.find(c => c.id === selectedChampionship)

  const performDraw = () => {
    if (teams.length < numberOfGroups) {
      toast({
        title: "Equipes insuficientes",
        description: "O número de equipes deve ser maior ou igual ao número de grupos.",
        variant: "destructive"
      })
      return
    }

    setIsDrawing(true)
    
    // Simulate drawing animation
    setTimeout(() => {
      // Shuffle teams
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5)
      
      // Distribute teams into groups
      const groups: { group: string; teams: string[] }[] = []
      const groupLetters = "ABCDEFGH".split("")
      
      for (let i = 0; i < numberOfGroups; i++) {
        groups.push({ group: groupLetters[i], teams: [] })
      }
      
      shuffledTeams.forEach((team, index) => {
        const groupIndex = index % numberOfGroups
        groups[groupIndex].teams.push(team.name)
      })
      
      setDrawResult(groups)
      setIsDrawing(false)
      
      toast({
        title: "Sorteio realizado!",
        description: "Revise os grupos e confirme para salvar."
      })
    }, 1500)
  }

  const saveDraw = () => {
    if (!drawResult || !selectedChamp || !user) return

    store.addDraw({
      championshipId: selectedChampionship,
      modality: selectedChamp.modality,
      category: selectedChamp.category,
      groups: numberOfGroups,
      result: drawResult,
      executedBy: user.name,
      executedAt: new Date().toISOString(),
      validated: false
    })

    toast({
      title: "Sorteio salvo!",
      description: "O sorteio foi registrado e aguarda validação."
    })

    router.push("/admin/sorteios")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/sorteios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Sorteio</h1>
          <p className="text-muted-foreground">
            Configure e realize o sorteio de grupos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Configuração do Sorteio</CardTitle>
            <CardDescription>
              Selecione o campeonato e configure os grupos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato</Label>
              <Select value={selectedChampionship} onValueChange={setSelectedChampionship}>
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
              <>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">
                      {selectedChamp.modality} - {selectedChamp.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {teams.length} equipes inscritas
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groups">Número de Grupos</Label>
                  <Input
                    id="groups"
                    type="number"
                    min={2}
                    max={8}
                    value={numberOfGroups}
                    onChange={(e) => setNumberOfGroups(parseInt(e.target.value) || 2)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {teams.length > 0 
                      ? `Aproximadamente ${Math.ceil(teams.length / numberOfGroups)} equipes por grupo`
                      : "Selecione um campeonato com equipes inscritas"
                    }
                  </p>
                </div>

                {/* Teams List */}
                <div className="space-y-2">
                  <Label>Equipes Participantes</Label>
                  <div className="max-h-48 overflow-y-auto space-y-1 p-2 border rounded-lg">
                    {teams.length > 0 ? (
                      teams.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center gap-2 p-2 rounded bg-muted/50"
                        >
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-card-foreground">{team.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma equipe inscrita neste campeonato
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={performDraw}
                  disabled={teams.length < 2 || isDrawing}
                >
                  {isDrawing ? (
                    <>
                      <Shuffle className="w-4 h-4 mr-2 animate-spin" />
                      Sorteando...
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-4 h-4 mr-2" />
                      Realizar Sorteio
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Resultado do Sorteio</CardTitle>
            <CardDescription>
              Visualize a composição dos grupos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {drawResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {drawResult.map((group) => (
                    <div
                      key={group.group}
                      className="p-4 rounded-lg border border-primary/30 bg-primary/5"
                    >
                      <h3 className="font-bold text-primary mb-3">
                        Grupo {group.group}
                      </h3>
                      <ul className="space-y-2">
                        {group.teams.map((teamName, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-card-foreground"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                              {idx + 1}
                            </span>
                            {teamName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={performDraw}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Sortear Novamente
                  </Button>
                  <Button className="flex-1" onClick={saveDraw}>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar e Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shuffle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  Aguardando Sorteio
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure os parâmetros e clique em{" "}
                  <span className="font-medium">Realizar Sorteio</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
