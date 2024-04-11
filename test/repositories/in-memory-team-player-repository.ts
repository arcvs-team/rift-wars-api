import { type TeamPlayerRepository } from '@/domain/team/application/repositories/team-player-repository'
import { type TeamPlayer } from '@/domain/team/enterprise/entities/team-player'

export class InMemoryTeamPlayerRepository implements TeamPlayerRepository {
  public items: TeamPlayer[] = []

  async create (teamPlayer: TeamPlayer): Promise<void> {
    this.items.push(teamPlayer)
  }
}
