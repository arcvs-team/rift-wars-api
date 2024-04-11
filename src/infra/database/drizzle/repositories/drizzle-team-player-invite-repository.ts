import { type TeamPlayerInviteRepository } from '@/domain/team/application/repositories/team-player-invite-repository'
import { type TeamPlayerInvite } from '@/domain/team/enterprise/entities/team-player-invite'
import { DrizzleTeamPlayerInviteMapper } from '../mappers/drizzle-team-player-invite-mapper'
import { db } from '../connection'
import { teamPlayerInvites } from '../schema'
import { injectable } from 'inversify'
import { and, eq } from 'drizzle-orm'

@injectable()
export class DrizzleTeamPlayerInviteRepository implements TeamPlayerInviteRepository {
  async findByPlayerIdAndTeamId (playerId: string, teamId: string): Promise<TeamPlayerInvite | null> {
    const result = await db.select().from(teamPlayerInvites).where(
      and(
        eq(teamPlayerInvites.playerId, playerId),
        eq(teamPlayerInvites.teamId, teamId)
      )
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzleTeamPlayerInviteMapper.toDomain(result[0])
  }

  async create (teamPlayerInvite: TeamPlayerInvite): Promise<void> {
    const data = DrizzleTeamPlayerInviteMapper.toPersistence(teamPlayerInvite)
    await db.insert(teamPlayerInvites).values(data)
  }
}
