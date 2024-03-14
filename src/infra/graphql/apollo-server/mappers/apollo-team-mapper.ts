import { type Team } from '@/domain/team/enterprise/entities/team'

export class ApolloTeamMapper {
  static toApollo (team: Team) {
    return {
      id: team.id.toString(),
      name: team.name,
      createdBy: team.createdBy.toString(),
      createdAt: team.createdAt,
      updatedAt: team.updatedAt
    }
  }
}
