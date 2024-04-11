import { type RiotGameResultRepository } from '@/domain/match/application/repositories/riot-game-result-repository'
import { type RiotGameResult } from '@/domain/match/enterprise/entities/riot-game-result'

export class InMemoryRiotGameResultRepository implements RiotGameResultRepository {
  public items: RiotGameResult[] = []

  async create (riotGameResult: RiotGameResult): Promise<void> {
    this.items.push(riotGameResult)
  }
}
