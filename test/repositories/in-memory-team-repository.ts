import { type TeamRepository } from '@/domain/application/repositories/team-repository'
import { type Team } from '@/domain/enterprise/team'

export class InMemoryTeamRepository implements TeamRepository {
  public items: Team[] = []

  async create (team: Team): Promise<void> {
    this.items.push(team)
  }

  async findMany (): Promise<Team[]> {
    return this.items
  }

  async findManyByCreatedBy (createdBy: string): Promise<Team[]> {
    return this.items.filter((team) => team.createdBy.toString() === createdBy)
  }
}