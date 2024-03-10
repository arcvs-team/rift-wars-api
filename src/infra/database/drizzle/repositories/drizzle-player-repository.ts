import { db } from '../connection'
import { players } from '../schema'
import { injectable } from 'inversify'
import { type PlayerRepository } from '@/domain/application/repositories/player-repository'
import { DrizzlePlayerMapper } from '../mappers/drizzle-player-mapper'
import { type Player } from '@/domain/enterprise/player'
import { eq, or } from 'drizzle-orm'

@injectable()
export class DrizzlePlayerRepository implements PlayerRepository {
  async findMany (): Promise<Player[]> {
    const result = await db.select().from(players)

    return result.map(DrizzlePlayerMapper.toDomain)
  }

  async findByEmailOrRiotId (email: string, riotId: string): Promise<Player | null> {
    const result = await db.select().from(players).where(
      or(
        eq(players.email, email),
        eq(players.riotId, riotId)
      )
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzlePlayerMapper.toDomain(result[0])
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
