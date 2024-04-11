import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DrizzleRiotTournamentProvider } from '../schema'
import { RiotTournamentProvider } from '@/domain/tournament/enterprise/entities/riot-tournament-provider'

export class DrizzleRiotTournamentProviderMapper {
  static toDomain (raw: DrizzleRiotTournamentProvider): RiotTournamentProvider {
    return RiotTournamentProvider.create(
      {
        providerId: raw.providerId,
        region: raw.region,
        url: raw.url,
        isActive: raw.isActive ?? false,
        createdAt: raw.createdAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (riotTournamentProvider: RiotTournamentProvider): DrizzleRiotTournamentProvider {
    return {
      id: riotTournamentProvider.id.toString(),
      providerId: riotTournamentProvider.providerId,
      region: riotTournamentProvider.region,
      url: riotTournamentProvider.url,
      isActive: riotTournamentProvider.isActive,
      createdAt: riotTournamentProvider.createdAt ?? null
    }
  }
}
