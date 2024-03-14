import { db } from '../connection'
import { players } from '../schema'
import { injectable } from 'inversify'
import { DrizzlePlayerMapper } from '../mappers/drizzle-player-mapper'
import { eq, or } from 'drizzle-orm'
import { type PlayerRepository } from '@/domain/player/application/repositories/player-repository'
import { type Player } from '@/domain/player/enterprise/entities/player'

@injectable()
export class DrizzlePlayerRepository implements PlayerRepository {
  async findById (id: string): Promise<Player | null> {
    const result = await db.select().from(players).where(
      eq(players.id, id)
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzlePlayerMapper.toDomain(result[0])
  }

  async findMany (): Promise<Player[]> {
    const result = await db.select().from(players)

    return result.map(DrizzlePlayerMapper.toDomain)
  }

  async findByEmail (email: string): Promise<Player | null> {
    const result = await db.select().from(players).where(
      eq(players.email, email)
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzlePlayerMapper.toDomain(result[0])
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

  async create (player: Player): Promise<void> {
    const data = DrizzlePlayerMapper.toPersistence(player)
    await db.insert(players).values(data)
  }
}
