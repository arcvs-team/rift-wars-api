import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DrizzlePlayer } from '../schema'
import { Player } from '@/domain/player/enterprise/entities/player'

export class DrizzlePlayerMapper {
  static toDomain (raw: DrizzlePlayer): Player {
    return Player.create(
      {
        email: raw.email,
        riotId: raw.riotId,
        password: raw.password,
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
      password: player.password,
      createdAt: player.createdAt ?? null,
      updatedAt: player.updatedAt ?? null
    }
  }
}
