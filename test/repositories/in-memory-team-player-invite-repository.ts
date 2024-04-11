import { type TeamPlayerInviteRepository } from '@/domain/team/application/repositories/team-player-invite-repository'
import { type TeamPlayerInvite } from '@/domain/team/enterprise/entities/team-player-invite'

export class InMemoryTeamPlayerInviteRepository implements TeamPlayerInviteRepository {
  public items: TeamPlayerInvite[] = []

  async findByPlayerIdAndTeamId (playerId: string, teamId: string): Promise<TeamPlayerInvite | null> {
    return this.items.find((teamPlayerInvite) => teamPlayerInvite.playerId.toString() === playerId && teamPlayerInvite.teamId.toString() === teamId) ?? null
  }

  async create (teamPlayerInvite: TeamPlayerInvite): Promise<void> {
    this.items.push(teamPlayerInvite)
  }
}
