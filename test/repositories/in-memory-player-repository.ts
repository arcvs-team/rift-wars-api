import { type PlayerRepository } from '@/domain/player/application/repositories/player-repository'
import { type Player } from '@/domain/player/enterprise/entities/player'

export class InMemoryPlayerRepository implements PlayerRepository {
  public items: Player[] = []

  async findById (id: string): Promise<Player | null> {
    const player = this.items.find(player => player.id.toString() === id)

    if (player === undefined) {
      return null
    }

    return player
  }

  async findMany (): Promise<Player[]> {
    return this.items
  }

  async findByEmail (email: string): Promise<Player | null> {
    const player = this.items.find(player => player.email === email)

    if (player === undefined) {
      return null
    }

    return player
  }

  async findByEmailOrRiotId (email: string, riotId: string): Promise<Player | null> {
    const player = this.items.find(player => player.email === email || player.riotId === riotId)

    if (player === undefined) {
      return null
    }

    return player
  }

  async create (player: Player): Promise<void> {
    this.items.push(player)
  }
}
