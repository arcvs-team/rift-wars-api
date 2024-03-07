import { db } from '../connection'
import { players } from '../schema'
import { injectable } from 'inversify'
import { type PlayerRepository } from '@/domain/application/repositories/player-repository'
import { DrizzlePlayerMapper } from '../mappers/drizzle-player-mapper'
import { type Player } from '@/domain/enterprise/player'

@injectable()
export class DrizzlePlayerRepository implements PlayerRepository {
  async findMany (): Promise<Player[]> {
    const result = await db.select().from(players)

    return result.map(DrizzlePlayerMapper.toDomain)
  }

  async create (player: Player): Promise<Player> {
    const result = await db.insert(players).values({
      email: player.email,
      riotId: player.riotId
    })

    player.id = result[0].insertId

    return player
  }
}
