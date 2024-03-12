import { db } from '../connection'
import { injectable } from 'inversify'
import { type Team } from '@/domain/enterprise/team'
import { type TeamRepository } from '@/domain/application/repositories/team-repository'
import { teams } from '../schema'
import { DrizzleTeamMapper } from '../mappers/drizzle-team-mapper'
import { eq } from 'drizzle-orm'

@injectable()
export class DrizzleTeamRepository implements TeamRepository {
  async create (team: Team): Promise<void> {
    const data = DrizzleTeamMapper.toPersistence(team)
    await db.insert(teams).values(data)
  }

  async findMany (): Promise<Team[]> {
    const result = await db.select().from(teams)

    return result.map(DrizzleTeamMapper.toDomain)
  }

  async findManyByCreatedBy (createdBy: string): Promise<Team[]> {
    const result = await db.select().from(teams).where(
      eq(teams.createdBy, createdBy)
    )

    return result.map(DrizzleTeamMapper.toDomain)
  }
}
