import { type Tournament } from '@/domain/enterprise/tournament'

export interface TournamentRepository {
  create: (tournament: Tournament) => Promise<void>
  findMany: () => Promise<Tournament[]>
}
