import { Player } from '../../../../domain/enterprise/player'

interface DrizzlePlayer {
  id: number
  email: string
  riotId: string
  createdAt: Date | null
  updatedAt: Date | null
}

export class DrizzlePlayerMapper {
  static toDomain (raw: DrizzlePlayer): Player {
    return Player.create(
      {
        email: raw.email,
        riotId: raw.riotId
      }
    )
  }
}
