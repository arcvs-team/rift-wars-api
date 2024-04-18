import { type TeamPlayerRepository } from '@/domain/team/application/repositories/team-player-repository'
import { type TeamPlayer } from '@/domain/team/enterprise/entities/team-player'
import { DrizzleTeamPlayerMapper } from '../mappers/drizzle-team-player-mapper'
import { db } from '../connection'
import { teamPlayers } from '../schema'
import { injectable } from 'inversify'
import { and, eq } from 'drizzle-orm'

@injectable()
export class DrizzleTeamPlayerRepository implements TeamPlayerRepository {
  async findByPlayerIdAndTeamId (playerId: string, teamId: string): Promise<TeamPlayer | null> {
    const result = await db.select().from(teamPlayers).where(
      and(
        eq(teamPlayers.playerId, playerId),
        eq(teamPlayers.teamId, teamId)
      )
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzleTeamPlayerMapper.toDomain(result[0])
  }

  async findManyByTeamId (teamId: string): Promise<TeamPlayer[]> {
    const result = await db.select().from(teamPlayers).where(
      and(
        eq(teamPlayers.teamId, teamId)
      )
    )

    return result.map(DrizzleTeamPlayerMapper.toDomain)
  }

  async create (teamPlayer: TeamPlayer): Promise<void> {
    const data = DrizzleTeamPlayerMapper.toPersistence(teamPlayer)
    await db.insert(teamPlayers).values(data)
  }

  async save (teamPlayer: TeamPlayer): Promise<void> {
    const data = DrizzleTeamPlayerMapper.toPersistence(teamPlayer)
    await db.update(teamPlayers).set(data).where(
      eq(teamPlayers.id, teamPlayer.id.toString())
    )
  }
}
