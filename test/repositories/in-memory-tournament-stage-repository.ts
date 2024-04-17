import { type TournamentStageRepository } from '@/domain/tournament/application/repositories/tournament-stage-repository'
import { type TournamentStage } from '@/domain/tournament/enterprise/entities/tournament-stage'

export class InMemoryTournamentStageRepository implements TournamentStageRepository {
  public items: TournamentStage[] = []

  async findManyByTournamentId (tournamentId: string): Promise<TournamentStage[]> {
    return this.items.filter((item) => item.tournamentId.toString() === tournamentId)
  }

  async create (tournamentStage: TournamentStage): Promise<void> {
    this.items.push(tournamentStage)
  }
}
