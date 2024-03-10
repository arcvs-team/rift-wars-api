import { type PlayerRepository } from '@/domain/application/repositories/player-repository'
import { type Player } from '@/domain/enterprise/player'

export class InMemoryPlayerRepository implements PlayerRepository {
  public items: Player[] = []

  async findMany (): Promise<Player[]> {
    return this.items
  }

  async findByEmailOrRiotId (email: string, riotId: string): Promise<Player | null> {
    const player = this.items.find(player => player.email === email || player.riotId === riotId)

    if (player === undefined) {
      return null
    }

    return player
  }

  async create (player: Player): Promise<Player> {
    player.id = this.items.length + 1
    this.items.push(player)
    return player
  }
}
