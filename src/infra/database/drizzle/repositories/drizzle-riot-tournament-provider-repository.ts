import { db } from '../connection'
import { type RiotTournamentProviderRepository } from '@/domain/tournament/application/repositories/riot-tournament-provider-repository'
import { type RiotTournamentProvider } from '@/domain/tournament/enterprise/entities/riot-tournament-provider'
import { injectable } from 'inversify'
import { riotTournamentProviders } from '../schema'
import { eq, desc } from 'drizzle-orm'
import { DrizzleRiotTournamentProviderMapper } from '../mappers/drizzle-riot-tournament-provider-mapper'

@injectable()
export class DrizzleRiotTournamentProviderRepository implements RiotTournamentProviderRepository {
  async findActiveProvider (): Promise<RiotTournamentProvider | null> {
    const result = await db.select().from(riotTournamentProviders).where(
      eq(riotTournamentProviders.isActive, true)
    ).orderBy(desc(riotTournamentProviders.createdAt)).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzleRiotTournamentProviderMapper.toDomain(result[0])
  }
}
