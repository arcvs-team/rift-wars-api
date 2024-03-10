import { type Player } from '../../enterprise/player'

export interface PlayerRepository {
  findMany: () => Promise<Player[]>
  findByEmailOrRiotId: (email: string, riotId: string) => Promise<Player | null>
  create: (player: Player) => Promise<Player>
}
