import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Player } from '../../../../domain/enterprise/player'
import { type DrizzlePlayer } from '../schema'

export class DrizzlePlayerMapper {
  static toDomain (raw: DrizzlePlayer): Player {
    return Player.create(
      {
        email: raw.email,
        riotId: raw.riotId,
        createdAt: raw.createdAt ?? undefined,
        updatedAt: raw.updatedAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (player: Player): DrizzlePlayer {
    return {
      id: player.id.toString(),
      email: player.email,
      riotId: player.riotId,
      createdAt: player.createdAt ?? null,
      updatedAt: player.updatedAt ?? null
    }
  }
}
