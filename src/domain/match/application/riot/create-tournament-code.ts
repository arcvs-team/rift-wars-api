interface QueryParams {
  count: number
  tournamentId: number
}

interface BodyParams {
  allowedParticipants: string[]
  metadata: string
  teamSize: number
  pickType: 'BLIND_PICK' | 'DRAFT_MODE' | 'ALL_RANDOM' | 'TOURNAMENT_DRAFT'
  mapType: 'SUMMONERS_RIFT' | 'HOWLING_ABYSS'
  spectatorType: 'NONE' | 'LOBBYONLY' | 'ALL'
  enoughPlayers: boolean
}

export interface CreateTournamentCodeParams {
  query: QueryParams
  body: BodyParams
}

export interface CreateTournamentCode {
  createTournamentCode: (data: CreateTournamentCodeParams) => Promise<string[]>
}
