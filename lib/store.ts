// SGCE - Sistema de Gestão de Competições Esportivas
// Data Store with mock data and state management

export type UserRole = 'admin' | 'representante' | 'atleta'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  teamId?: string
  athleteId?: string
}

export interface Championship {
  id: string
  name: string
  modality: string
  category: string
  startDate: string
  endDate: string
  maxTeams?: number
  status: 'rascunho' | 'inscricoes_abertas' | 'em_andamento' | 'finalizado'
  regulation: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  representativeId: string
  championshipId: string
  status: 'inscrita' | 'confirmada' | 'pendente'
  createdAt: string
}

export interface Athlete {
  id: string
  name: string
  birthDate: string
  position: string
  teamId: string
  photo: string
  status: 'ativo' | 'pendente'
  createdAt: string
}

export interface Draw {
  id: string
  championshipId: string
  modality: string
  category: string
  groups: number
  result: DrawResult[]
  executedBy: string
  executedAt: string
  validated: boolean
  validatedBy?: string
  validatedAt?: string
}

export interface DrawResult {
  group: string
  teams: string[]
}

export interface Appeal {
  id: string
  teamId: string
  championshipId: string
  title: string
  description: string
  status: 'pendente' | 'deferido' | 'indeferido'
  opinion?: string
  createdBy: string
  createdAt: string
  decidedBy?: string
  decidedAt?: string
}

export interface Match {
  id: string
  championshipId: string
  round: string
  homeTeamId: string
  awayTeamId: string
  homeScore?: number
  awayScore?: number
  date: string
  time: string
  location: string
  status: 'agendada' | 'em_andamento' | 'finalizada' | 'cancelada'
}

export interface ActivityLog {
  id: string
  type: string
  description: string
  userId: string
  userName: string
  userRole: string
  createdAt: string
}

// Initial Users
const initialUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@sgce.com',
    password: 'admin123',
    name: 'Organizador Silva',
    role: 'admin'
  },
  {
    id: 'user-2',
    email: 'representante@sgce.com',
    password: 'rep123',
    name: 'Carlos Representante',
    role: 'representante',
    teamId: 'team-1'
  },
  {
    id: 'user-3',
    email: 'atleta@sgce.com',
    password: 'atleta123',
    name: 'João Atleta',
    role: 'atleta',
    athleteId: 'athlete-1'
  }
]

// Initial Championships
const initialChampionships: Championship[] = [
  {
    id: 'champ-1',
    name: 'Campeonato Municipal Sub-17',
    modality: 'Futebol',
    category: 'Sub-17',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    maxTeams: 12,
    status: 'inscricoes_abertas',
    regulation: 'Campeonato em formato de grupos com fase eliminatória. Cada equipe pode inscrever até 25 atletas. Jogos com dois tempos de 35 minutos.',
    createdAt: '2025-01-10T10:00:00'
  },
  {
    id: 'champ-2',
    name: 'Copa Primavera Sub-15',
    modality: 'Futebol',
    category: 'Sub-15',
    startDate: '2026-03-15',
    endDate: '2026-05-30',
    maxTeams: 8,
    status: 'inscricoes_abertas',
    regulation: 'Copa eliminatória com jogos de ida e volta nas semifinais e final.',
    createdAt: '2025-01-15T14:00:00'
  }
]

// Initial Teams
const initialTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Tigres FC',
    representativeId: 'user-2',
    championshipId: 'champ-1',
    status: 'confirmada',
    createdAt: '2025-01-14T21:00:00'
  },
  {
    id: 'team-2',
    name: 'Leões Unidos',
    representativeId: 'user-2',
    championshipId: 'champ-1',
    status: 'confirmada',
    createdAt: '2025-01-15T21:00:00'
  },
  {
    id: 'team-3',
    name: 'Águias Douradas',
    representativeId: 'user-2',
    championshipId: 'champ-1',
    status: 'confirmada',
    createdAt: '2025-01-16T21:00:00'
  },
  {
    id: 'team-4',
    name: 'Falcões SC',
    representativeId: 'user-2',
    championshipId: 'champ-2',
    status: 'inscrita',
    createdAt: '2025-01-20T15:00:00'
  }
]

// Initial Athletes
const initialAthletes: Athlete[] = [
  {
    id: 'athlete-1',
    name: 'João Atleta',
    birthDate: '2009-05-15',
    position: 'Atacante',
    teamId: 'team-1',
    photo: '/placeholder.svg?height=200&width=200',
    status: 'ativo',
    createdAt: '2025-01-14T22:00:00'
  },
  {
    id: 'athlete-2',
    name: 'Pedro Santos',
    birthDate: '2009-08-20',
    position: 'Meio-campo',
    teamId: 'team-1',
    photo: '/placeholder.svg?height=200&width=200',
    status: 'ativo',
    createdAt: '2025-01-14T22:30:00'
  },
  {
    id: 'athlete-3',
    name: 'Lucas Oliveira',
    birthDate: '2009-03-10',
    position: 'Goleiro',
    teamId: 'team-2',
    photo: '/placeholder.svg?height=200&width=200',
    status: 'ativo',
    createdAt: '2025-01-15T22:00:00'
  },
  {
    id: 'athlete-4',
    name: 'Matheus Costa',
    birthDate: '2009-11-25',
    position: 'Zagueiro',
    teamId: 'team-3',
    photo: '/placeholder.svg?height=200&width=200',
    status: 'ativo',
    createdAt: '2025-01-16T22:00:00'
  },
  {
    id: 'athlete-5',
    name: 'Gabriel Ferreira',
    birthDate: '2009-07-08',
    position: 'Lateral',
    teamId: 'team-1',
    photo: '/placeholder.svg?height=200&width=200',
    status: 'pendente',
    createdAt: '2025-01-17T10:00:00'
  }
]

// Initial Draws
const initialDraws: Draw[] = [
  {
    id: 'draw-1',
    championshipId: 'champ-1',
    modality: 'Futebol',
    category: 'Sub-17',
    groups: 2,
    result: [
      { group: 'A', teams: ['Tigres FC', 'Leões Unidos'] },
      { group: 'B', teams: ['Águias Douradas'] }
    ],
    executedBy: 'Organizador Silva',
    executedAt: '2025-01-20T10:30:00',
    validated: true,
    validatedBy: 'Organizador Silva',
    validatedAt: '2025-01-20T11:00:00'
  }
]

// Initial Appeals
const initialAppeals: Appeal[] = [
  {
    id: 'appeal-1',
    teamId: 'team-1',
    championshipId: 'champ-1',
    title: 'Solicitação de adiamento de partida',
    description: 'Solicitamos o adiamento da partida do dia 04/02 devido a compromissos previamente agendados com atletas em avaliação médica.',
    status: 'deferido',
    opinion: 'Solicitação deferida. A partida será remarcada para data a ser definida.',
    createdBy: 'Carlos Representante',
    createdAt: '2025-01-22T09:00:00',
    decidedBy: 'Organizador Silva',
    decidedAt: '2025-01-23T11:00:00'
  },
  {
    id: 'appeal-2',
    teamId: 'team-1',
    championshipId: 'champ-1',
    title: 'Contestação de resultado - Jogo 15',
    description: 'Contestamos o resultado da partida devido a irregularidade na escalação da equipe adversária.',
    status: 'pendente',
    createdBy: 'Carlos Representante',
    createdAt: '2025-01-25T14:20:00'
  }
]

// Initial Matches
const initialMatches: Match[] = [
  {
    id: 'match-1',
    championshipId: 'champ-1',
    round: '1ª Rodada',
    homeTeamId: 'team-1',
    awayTeamId: 'team-2',
    homeScore: 3,
    awayScore: 1,
    date: '2026-02-04',
    time: '14:00',
    location: 'Estádio Municipal',
    status: 'finalizada'
  },
  {
    id: 'match-2',
    championshipId: 'champ-1',
    round: '2ª Rodada',
    homeTeamId: 'team-3',
    awayTeamId: 'team-1',
    homeScore: 2,
    awayScore: 2,
    date: '2026-02-07',
    time: '16:00',
    location: 'Estádio Municipal',
    status: 'finalizada'
  },
  {
    id: 'match-3',
    championshipId: 'champ-1',
    round: '3ª Rodada',
    homeTeamId: 'team-2',
    awayTeamId: 'team-3',
    date: '2026-02-11',
    time: '15:00',
    location: 'Campo da Vila',
    status: 'agendada'
  },
  {
    id: 'match-4',
    championshipId: 'champ-1',
    round: '4ª Rodada',
    homeTeamId: 'team-1',
    awayTeamId: 'team-3',
    date: '2026-02-14',
    time: '14:30',
    location: 'Estádio Municipal',
    status: 'agendada'
  }
]

// Initial Activity Logs
const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    type: 'recurso',
    description: 'Novo recurso: Contestação de resultado - Jogo 15',
    userId: 'user-2',
    userName: 'Carlos Representante',
    userRole: 'Representante',
    createdAt: '2025-01-25T14:20:00'
  },
  {
    id: 'log-2',
    type: 'recurso',
    description: 'Recurso respondido: Solicitação de adiamento de partida',
    userId: 'user-1',
    userName: 'Organizador Silva',
    userRole: 'Organizador',
    createdAt: '2025-01-23T11:00:00'
  },
  {
    id: 'log-3',
    type: 'sorteio',
    description: 'Sorteio realizado: Futebol - Sub-17',
    userId: 'user-1',
    userName: 'Organizador Silva',
    userRole: 'Organizador',
    createdAt: '2025-01-20T10:30:00'
  },
  {
    id: 'log-4',
    type: 'equipe',
    description: 'Equipe cadastrada: Leões Unidos',
    userId: 'user-2',
    userName: 'Carlos Representante',
    userRole: 'Representante',
    createdAt: '2025-01-15T21:00:00'
  },
  {
    id: 'log-5',
    type: 'equipe',
    description: 'Equipe cadastrada: Tigres FC',
    userId: 'user-2',
    userName: 'Carlos Representante',
    userRole: 'Representante',
    createdAt: '2025-01-14T21:00:00'
  }
]

// Store class to manage state
class Store {
  private users: User[] = [...initialUsers]
  private championships: Championship[] = [...initialChampionships]
  private teams: Team[] = [...initialTeams]
  private athletes: Athlete[] = [...initialAthletes]
  private draws: Draw[] = [...initialDraws]
  private appeals: Appeal[] = [...initialAppeals]
  private matches: Match[] = [...initialMatches]
  private activityLogs: ActivityLog[] = [...initialActivityLogs]
  private currentUser: User | null = null

  // Auth methods
  login(email: string, password: string): User | null {
    const user = this.users.find(u => u.email === email && u.password === password)
    if (user) {
      this.currentUser = user
      if (typeof window !== 'undefined') {
        localStorage.setItem('sgce_user', JSON.stringify(user))
      }
    }
    return user || null
  }

  logout() {
    this.currentUser = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sgce_user')
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sgce_user')
      if (stored) {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      }
    }
    return null
  }

  // User methods
  getUsers(): User[] {
    return this.users
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id)
  }

  // Championship methods
  getChampionships(): Championship[] {
    return this.championships
  }

  getChampionshipById(id: string): Championship | undefined {
    return this.championships.find(c => c.id === id)
  }

  addChampionship(championship: Omit<Championship, 'id' | 'createdAt'>): Championship {
    const newChampionship: Championship = {
      ...championship,
      id: `champ-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.championships.push(newChampionship)
    this.addActivityLog('campeonato', `Campeonato criado: ${championship.name}`)
    return newChampionship
  }

  updateChampionship(id: string, data: Partial<Championship>): Championship | undefined {
    const index = this.championships.findIndex(c => c.id === id)
    if (index !== -1) {
      this.championships[index] = { ...this.championships[index], ...data }
      return this.championships[index]
    }
    return undefined
  }

  // Team methods
  getTeams(): Team[] {
    return this.teams
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find(t => t.id === id)
  }

  getTeamsByChampionship(championshipId: string): Team[] {
    return this.teams.filter(t => t.championshipId === championshipId)
  }

  getTeamsByRepresentative(representativeId: string): Team[] {
    return this.teams.filter(t => t.representativeId === representativeId)
  }

  addTeam(team: Omit<Team, 'id' | 'createdAt'>): Team {
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.teams.push(newTeam)
    this.addActivityLog('equipe', `Equipe cadastrada: ${team.name}`)
    return newTeam
  }

  updateTeam(id: string, data: Partial<Team>): Team | undefined {
    const index = this.teams.findIndex(t => t.id === id)
    if (index !== -1) {
      this.teams[index] = { ...this.teams[index], ...data }
      return this.teams[index]
    }
    return undefined
  }

  // Athlete methods
  getAthletes(): Athlete[] {
    return this.athletes
  }

  getAthleteById(id: string): Athlete | undefined {
    return this.athletes.find(a => a.id === id)
  }

  getAthletesByTeam(teamId: string): Athlete[] {
    return this.athletes.filter(a => a.teamId === teamId)
  }

  addAthlete(athlete: Omit<Athlete, 'id' | 'createdAt'>): Athlete {
    const newAthlete: Athlete = {
      ...athlete,
      id: `athlete-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.athletes.push(newAthlete)
    this.addActivityLog('atleta', `Atleta cadastrado: ${athlete.name}`)
    return newAthlete
  }

  updateAthlete(id: string, data: Partial<Athlete>): Athlete | undefined {
    const index = this.athletes.findIndex(a => a.id === id)
    if (index !== -1) {
      this.athletes[index] = { ...this.athletes[index], ...data }
      return this.athletes[index]
    }
    return undefined
  }

  // Draw methods
  getDraws(): Draw[] {
    return this.draws
  }

  getDrawById(id: string): Draw | undefined {
    return this.draws.find(d => d.id === id)
  }

  getDrawsByChampionship(championshipId: string): Draw[] {
    return this.draws.filter(d => d.championshipId === championshipId)
  }

  addDraw(draw: Omit<Draw, 'id'>): Draw {
    const newDraw: Draw = {
      ...draw,
      id: `draw-${Date.now()}`
    }
    this.draws.push(newDraw)
    this.addActivityLog('sorteio', `Sorteio realizado: ${draw.modality} - ${draw.category}`)
    return newDraw
  }

  validateDraw(id: string, validatedBy: string): Draw | undefined {
    const index = this.draws.findIndex(d => d.id === id)
    if (index !== -1) {
      this.draws[index].validated = true
      this.draws[index].validatedBy = validatedBy
      this.draws[index].validatedAt = new Date().toISOString()
      this.addActivityLog('sorteio', `Sorteio validado: ${this.draws[index].modality} - ${this.draws[index].category}`)
      return this.draws[index]
    }
    return undefined
  }

  // Appeal methods
  getAppeals(): Appeal[] {
    return this.appeals
  }

  getAppealById(id: string): Appeal | undefined {
    return this.appeals.find(a => a.id === id)
  }

  getAppealsByTeam(teamId: string): Appeal[] {
    return this.appeals.filter(a => a.teamId === teamId)
  }

  getPendingAppeals(): Appeal[] {
    return this.appeals.filter(a => a.status === 'pendente')
  }

  addAppeal(appeal: Omit<Appeal, 'id' | 'createdAt' | 'status'>): Appeal {
    const newAppeal: Appeal = {
      ...appeal,
      id: `appeal-${Date.now()}`,
      status: 'pendente',
      createdAt: new Date().toISOString()
    }
    this.appeals.push(newAppeal)
    this.addActivityLog('recurso', `Novo recurso: ${appeal.title}`)
    return newAppeal
  }

  decideAppeal(id: string, status: 'deferido' | 'indeferido', opinion: string, decidedBy: string): Appeal | undefined {
    const index = this.appeals.findIndex(a => a.id === id)
    if (index !== -1) {
      this.appeals[index].status = status
      this.appeals[index].opinion = opinion
      this.appeals[index].decidedBy = decidedBy
      this.appeals[index].decidedAt = new Date().toISOString()
      this.addActivityLog('recurso', `Recurso ${status}: ${this.appeals[index].title}`)
      return this.appeals[index]
    }
    return undefined
  }

  // Match methods
  getMatches(): Match[] {
    return this.matches
  }

  getMatchById(id: string): Match | undefined {
    return this.matches.find(m => m.id === id)
  }

  getMatchesByChampionship(championshipId: string): Match[] {
    return this.matches.filter(m => m.championshipId === championshipId)
  }

  addMatch(match: Omit<Match, 'id'>): Match {
    const newMatch: Match = {
      ...match,
      id: `match-${Date.now()}`
    }
    this.matches.push(newMatch)
    return newMatch
  }

  updateMatch(id: string, data: Partial<Match>): Match | undefined {
    const index = this.matches.findIndex(m => m.id === id)
    if (index !== -1) {
      this.matches[index] = { ...this.matches[index], ...data }
      return this.matches[index]
    }
    return undefined
  }

  // Activity Log methods
  getActivityLogs(): ActivityLog[] {
    return this.activityLogs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  addActivityLog(type: string, description: string) {
    const user = this.getCurrentUser()
    if (user) {
      const log: ActivityLog = {
        id: `log-${Date.now()}`,
        type,
        description,
        userId: user.id,
        userName: user.name,
        userRole: user.role === 'admin' ? 'Organizador' : user.role === 'representante' ? 'Representante' : 'Atleta',
        createdAt: new Date().toISOString()
      }
      this.activityLogs.unshift(log)
    }
  }

  // Statistics
  getStatistics() {
    const teams = this.getTeams()
    const athletes = this.getAthletes()
    const matches = this.getMatches()
    const appeals = this.getAppeals()
    const draws = this.getDraws()
    const championships = this.getChampionships()

    const finishedMatches = matches.filter(m => m.status === 'finalizada')
    const totalGoals = finishedMatches.reduce((sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0)

    return {
      totalTeams: teams.length,
      totalAthletes: athletes.length,
      activeAthletes: athletes.filter(a => a.status === 'ativo').length,
      pendingAthletes: athletes.filter(a => a.status === 'pendente').length,
      totalMatches: matches.length,
      scheduledMatches: matches.filter(m => m.status === 'agendada').length,
      finishedMatches: finishedMatches.length,
      totalGoals,
      avgGoalsPerMatch: finishedMatches.length > 0 ? totalGoals / finishedMatches.length : 0,
      pendingAppeals: appeals.filter(a => a.status === 'pendente').length,
      approvedAppeals: appeals.filter(a => a.status === 'deferido').length,
      rejectedAppeals: appeals.filter(a => a.status === 'indeferido').length,
      validatedDraws: draws.filter(d => d.validated).length,
      pendingDraws: draws.filter(d => !d.validated).length,
      totalChampionships: championships.length,
      openChampionships: championships.filter(c => c.status === 'inscricoes_abertas').length,
      avgAthletesPerTeam: teams.length > 0 ? athletes.length / teams.length : 0,
      completionRate: matches.length > 0 ? (finishedMatches.length / matches.length) * 100 : 0
    }
  }
}

export const store = new Store()
