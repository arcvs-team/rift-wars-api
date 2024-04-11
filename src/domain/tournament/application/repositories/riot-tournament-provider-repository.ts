import { type RiotTournamentProvider } from '../../enterprise/entities/riot-tournament-provider'

export interface RiotTournamentProviderRepository {
  findActiveProvider: () => Promise<RiotTournamentProvider | null>
}
