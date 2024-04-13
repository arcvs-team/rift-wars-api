import { type MatchRepository } from '@/domain/match/application/repositories/match-repository'
import { type Match } from '@/domain/match/enterprise/entities/match'

export class InMemoryMatchRepository implements MatchRepository {
  public items: Match[] = []

  async findManyByTournamentStageId (tournamentStageId: string): Promise<Match[]> {
    return this.items.filter((item) => item.tournamentStageId.toString() === tournamentStageId)
  }
}
