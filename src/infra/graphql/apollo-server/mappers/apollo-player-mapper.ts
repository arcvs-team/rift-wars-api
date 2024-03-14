import { type Player } from '@/domain/player/enterprise/entities/player'

export class ApolloPlayerMapper {
  static toApollo (player: Player) {
    return {
      id: player.id.toString(),
      email: player.email,
      riotId: player.riotId,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt
    }
  }
}
