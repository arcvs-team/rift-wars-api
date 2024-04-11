export interface CreateTournamentParams {
  providerId: number
  name: string
}

export interface CreateTournament {
  createTournament: (data: CreateTournamentParams) => Promise<number>
}
