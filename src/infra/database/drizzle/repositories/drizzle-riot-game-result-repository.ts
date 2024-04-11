import { db } from '../connection'
import { type RiotGameResultRepository } from '@/domain/match/application/repositories/riot-game-result-repository'
import { type RiotGameResult } from '@/domain/match/enterprise/entities/riot-game-result'
import { DrizzleRiotGameResultMapper } from '../mappers/drizzle-riot-game-result'
import { riotGameResults } from '../schema'

export class DrizzleRiotGameResultRepository implements RiotGameResultRepository {
  async create (riotGameResult: RiotGameResult): Promise<void> {
    const data = DrizzleRiotGameResultMapper.toPersistence(riotGameResult)
    await db.insert(riotGameResults).values(data)
  }
}
