import { type Tournament } from '../../enterprise/entities/tournament'

export interface TournamentRepository {
  findById: (id: string) => Promise<Tournament | null>
  findMany: () => Promise<Tournament[]>
  create: (tournament: Tournament) => Promise<void>
}
