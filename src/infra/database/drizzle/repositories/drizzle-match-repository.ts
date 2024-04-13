import { type MatchRepository } from '@/domain/match/application/repositories/match-repository'
import { type Match } from '@/domain/match/enterprise/entities/match'
import { injectable } from 'inversify'
import { db } from '../connection'
import { matches } from '../schema'
import { eq } from 'drizzle-orm'
import { DrizzleMatchMapper } from '../mappers/drizzle-match-mapper'

@injectable()
export class DrizzleMatchRepository implements MatchRepository {
  async findManyByTournamentStageId (tournamentStageId: string): Promise<Match[]> {
    const result = await db.select().from(matches).where(
      eq(matches.tournamentStageId, tournamentStageId)
    )

    return result.map(DrizzleMatchMapper.toDomain)
  }
}
