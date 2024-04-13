import { type Match } from '../../enterprise/entities/match'

export interface MatchRepository {
  findManyByTournamentStageId: (tournamentStageId: string) => Promise<Match[]>
}
