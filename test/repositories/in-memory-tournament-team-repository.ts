import { type TournamentTeamRepository } from '@/domain/team/application/repositories/tournament-team-repository'
import { type TournamentTeam } from '@/domain/team/enterprise/entities/tournament-team'

export class InMemoryTournamentTeamRepository implements TournamentTeamRepository {
  public items: TournamentTeam[] = []

  async findManyByTournamentId (tournamentId: string): Promise<TournamentTeam[]> {
    return this.items.filter((item) => item.tournamentId.toString() === tournamentId)
  }

  async create (tournamentTeam: TournamentTeam): Promise<void> {
    this.items.push(tournamentTeam)
  }
}
