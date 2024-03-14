import { type Tournament } from '../../enterprise/entities/tournament'

export interface TournamentRepository {
  create: (tournament: Tournament) => Promise<void>
  findMany: () => Promise<Tournament[]>
}
