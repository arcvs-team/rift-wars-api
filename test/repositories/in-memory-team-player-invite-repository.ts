import { type TeamPlayerInviteRepository } from '@/domain/team/application/repositories/team-player-invite-repository'
import { type TeamPlayerInvite } from '@/domain/team/enterprise/entities/team-player-invite'

export class InMemoryTeamPlayerInviteRepository implements TeamPlayerInviteRepository {
  public items: TeamPlayerInvite[] = []

  async findById (id: string): Promise<TeamPlayerInvite | null> {
    return this.items.find((teamPlayerInvite) => teamPlayerInvite.id.toString() === id) ?? null
  }

  async findByPlayerIdAndTeamId (playerId: string, teamId: string): Promise<TeamPlayerInvite | null> {
    return this.items.find((teamPlayerInvite) => teamPlayerInvite.playerId.toString() === playerId && teamPlayerInvite.teamId.toString() === teamId) ?? null
  }

  async findManyOpenByPlayerId (playerId: string): Promise<TeamPlayerInvite[]> {
    return this.items.filter((teamPlayerInvite) => teamPlayerInvite.playerId.toString() === playerId && !teamPlayerInvite.acceptedAt && !teamPlayerInvite.rejectedAt)
  }

  async save (teamPlayerInvite: TeamPlayerInvite): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === teamPlayerInvite.id.toString())
    this.items[index] = teamPlayerInvite
  }

  async create (teamPlayerInvite: TeamPlayerInvite): Promise<void> {
    this.items.push(teamPlayerInvite)
  }
}
