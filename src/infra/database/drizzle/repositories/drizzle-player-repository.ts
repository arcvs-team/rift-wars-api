import { db } from '../connection'
import { type MySql2Database } from 'drizzle-orm/mysql2'
import { players } from '../schema'
import { DrizzlePlayerMapper } from '../mappers/drizzle-player-mapper'
import { injectable } from 'inversify'
import { type Player } from '../../../../domain/enterprise/player'
import { type PlayerRepository } from '../../../../domain/application/repositories/player-repository'

@injectable()
export class DrizzlePlayerRepository implements PlayerRepository {
  private readonly db: MySql2Database

  constructor () {
    this.db = db
  }

  async findMany (): Promise<Player[]> {
    const result = await this.db.select().from(players)

    return result.map(DrizzlePlayerMapper.toDomain)
  }

  async create (player: Player): Promise<Player> {
    const result = await this.db.insert(players).values({
      email: player.email,
      riotId: player.riotId
    })

    player.id = result[0].insertId

    return player
  }
}
