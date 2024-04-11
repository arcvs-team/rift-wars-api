import { type TeamPlayerRepository } from '@/domain/team/application/repositories/team-player-repository'
import { type TeamPlayer } from '@/domain/team/enterprise/entities/team-player'
import { DrizzleTeamPlayerMapper } from '../mappers/drizzle-team-player-mapper'
import { db } from '../connection'
import { teamPlayers } from '../schema'
import { injectable } from 'inversify'

@injectable()
export class DrizzleTeamPlayerRepository implements TeamPlayerRepository {
  async create (teamPlayer: TeamPlayer): Promise<void> {
    const data = DrizzleTeamPlayerMapper.toPersistence(teamPlayer)
    await db.insert(teamPlayers).values(data)
  }
}
