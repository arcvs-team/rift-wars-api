import { injectable } from 'inversify'
import { DrizzleTournamentMapper } from '../mappers/drizzle-tournament-mapper'
import { tournaments } from '../schema'
import { db } from '../connection'
import { type TournamentRepository } from '@/domain/tournament/application/repositories/tournament-repository'
import { type Tournament } from '@/domain/tournament/enterprise/entities/tournament'
import { eq } from 'drizzle-orm'

@injectable()
export class DrizzleTournamentRepository implements TournamentRepository {
  async findById (id: string): Promise<Tournament | null> {
    const result = await db.select().from(tournaments).where(
      eq(tournaments.id, id)
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzleTournamentMapper.toDomain(result[0])
  }

  async findMany (): Promise<Tournament[]> {
    const result = await db.select().from(tournaments)
    return result.map(DrizzleTournamentMapper.toDomain)
  }

  async create (tournament: Tournament): Promise<void> {
    const data = DrizzleTournamentMapper.toPersistence(tournament)
    await db.insert(tournaments).values(data)
  }
}
