import { db } from '../connection'
import { injectable } from 'inversify'
import { teams } from '../schema'
import { DrizzleTeamMapper } from '../mappers/drizzle-team-mapper'
import { eq } from 'drizzle-orm'
import { type TeamRepository } from '@/domain/team/application/repositories/team-repository'
import { type Team } from '@/domain/team/enterprise/entities/team'

@injectable()
export class DrizzleTeamRepository implements TeamRepository {
  async create (team: Team): Promise<void> {
    const data = DrizzleTeamMapper.toPersistence(team)
    await db.insert(teams).values(data)
  }

  async findById (id: string): Promise<Team | null> {
    const result = await db.select().from(teams).where(
      eq(teams.id, id)
    ).limit(1)

    if (result.length === 0) {
      return null
    }

    return DrizzleTeamMapper.toDomain(result[0])
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
