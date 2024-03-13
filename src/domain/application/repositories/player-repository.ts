import { type Player } from '../../enterprise/player'

export interface PlayerRepository {
  findById: (id: string) => Promise<Player | null>
  findMany: () => Promise<Player[]>
  findByEmail: (email: string) => Promise<Player | null>
  findByEmailOrRiotId: (email: string, riotId: string) => Promise<Player | null>
  create: (player: Player) => Promise<void>
}
