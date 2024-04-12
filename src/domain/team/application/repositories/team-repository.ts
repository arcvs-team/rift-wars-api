import { type Team } from '../../enterprise/entities/team'

export interface TeamRepository {
  create: (team: Team) => Promise<void>
  findById: (id: string) => Promise<Team | null>
  findMany: () => Promise<Team[]>
  findManyByCreatedBy: (createdBy: string) => Promise<Team[]>
}
