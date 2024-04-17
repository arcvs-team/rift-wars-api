import { type TournamentStageRepository } from '@/domain/tournament/application/repositories/tournament-stage-repository'
import { type TournamentStage } from '@/domain/tournament/enterprise/entities/tournament-stage'
import { db } from '../connection'
import { tournamentStages } from '../schema'
import { eq, asc } from 'drizzle-orm'
import { DrizzleTournamentStageMapper } from '../mappers/drizzle-tournament-stage-mapper'
import { injectable } from 'inversify'

@injectable()
export class DrizzleTournamentStageRepository implements TournamentStageRepository {
  async findManyByTournamentId (tournamentId: string): Promise<TournamentStage[]> {
    const result = await db.select().from(tournamentStages).where(
      eq(tournamentStages.tournamentId, tournamentId)
    ).orderBy(asc(tournamentStages.stage))

    return result.map(DrizzleTournamentStageMapper.toDomain)
  }

  async create (tournamentStage: TournamentStage): Promise<void> {
    const data = DrizzleTournamentStageMapper.toPersistence(tournamentStage)
    await db.insert(tournamentStages).values(data)
  }
}
