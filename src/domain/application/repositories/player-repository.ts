import { type Player } from '../../enterprise/player'

export interface PlayerRepository {
  findMany: () => Promise<Player[]>
  create: (player: Player) => Promise<Player>
}
