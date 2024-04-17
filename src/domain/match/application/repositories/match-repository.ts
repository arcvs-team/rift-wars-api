import { type Match } from '../../enterprise/entities/match'

export interface MatchRepository {
  create: (match: Match) => Promise<void>
  findManyByTournamentStageId: (tournamentStageId: string) => Promise<Match[]>
}
