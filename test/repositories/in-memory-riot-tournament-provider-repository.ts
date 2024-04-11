import { type RiotTournamentProviderRepository } from '@/domain/tournament/application/repositories/riot-tournament-provider-repository'
import { type RiotTournamentProvider } from '@/domain/tournament/enterprise/entities/riot-tournament-provider'

export class InMemoryRiotTournamentProviderRepository implements RiotTournamentProviderRepository {
  public items: RiotTournamentProvider[] = []

  async findActiveProvider (): Promise<RiotTournamentProvider | null> {
    return this.items.find((provider) => provider.isActive) ?? null
  }
}
