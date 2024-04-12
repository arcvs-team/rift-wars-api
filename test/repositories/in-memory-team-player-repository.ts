import { type TeamPlayerRepository } from '@/domain/team/application/repositories/team-player-repository'
import { type TeamPlayer } from '@/domain/team/enterprise/entities/team-player'

export class InMemoryTeamPlayerRepository implements TeamPlayerRepository {
  public items: TeamPlayer[] = []

  async findByPlayerIdAndTeamId (playerId: string, teamId: string): Promise<TeamPlayer | null> {
    return this.items.find((teamPlayer) => teamPlayer.playerId.toString() === playerId && teamPlayer.teamId.toString() === teamId) ?? null
  }

  async create (teamPlayer: TeamPlayer): Promise<void> {
    this.items.push(teamPlayer)
  }
}
