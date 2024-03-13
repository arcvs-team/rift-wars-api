import { type TournamentRepository } from '@/domain/application/repositories/tournament-repository'
import { type Tournament } from '@/domain/enterprise/tournament'
import { injectable } from 'inversify'
import { DrizzleTournamentMapper } from '../mappers/drizzle-tournament-mapper'
import { tournaments } from '../schema'
import { db } from '../connection'

@injectable()
export class DrizzleTournamentRepository implements TournamentRepository {
  async create (tournament: Tournament): Promise<void> {
    const data = DrizzleTournamentMapper.toPersistence(tournament)
    await db.insert(tournaments).values(data)
  }

  async findMany (): Promise<Tournament[]> {
    const result = await db.select().from(tournaments)
    return result.map(DrizzleTournamentMapper.toDomain)
  }
}
