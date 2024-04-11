import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DrizzleRiotGameResult } from '../schema'
import { RiotGameResult } from '@/domain/match/enterprise/entities/riot-game-result'

export class DrizzleRiotGameResultMapper {
  static toDomain (raw: DrizzleRiotGameResult): RiotGameResult {
    return RiotGameResult.create(
      {
        startTime: raw.startTime,
        shortCode: raw.shortCode,
        metaData: raw.metaData ?? undefined,
        gameId: raw.gameId,
        gameName: raw.gameName,
        gameType: raw.gameType,
        gameMap: raw.gameMap,
        gameMode: raw.gameMode,
        region: raw.region,
        createdAt: raw.createdAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (riotGameResult: RiotGameResult): DrizzleRiotGameResult {
    return {
      id: riotGameResult.id.toString(),
      startTime: riotGameResult.startTime,
      shortCode: riotGameResult.shortCode,
      metaData: riotGameResult.metaData ?? null,
      gameId: riotGameResult.gameId,
      gameName: riotGameResult.gameName,
      gameType: riotGameResult.gameType,
      gameMap: riotGameResult.gameMap,
      gameMode: riotGameResult.gameMode,
      region: riotGameResult.region,
      createdAt: riotGameResult.createdAt ?? null
    }
  }
}
