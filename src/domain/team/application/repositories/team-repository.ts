import { type Team } from '../../enterprise/entities/team'

export interface TeamRepository {
  create: (team: Team) => Promise<void>
  findMany: () => Promise<Team[]>
  findManyByCreatedBy: (createdBy: string) => Promise<Team[]>
}
