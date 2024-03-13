import { type Tournament } from '@/domain/enterprise/tournament'

export class ApolloTournamentMapper {
  static toApollo (tournament: Tournament) {
    return {
      id: tournament.id.toString(),
      name: tournament.name,
      description: tournament.description,
      rules: tournament.rules,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      winnerTeamId: tournament.winnerTeamId !== undefined ? tournament.winnerTeamId.toString() : null,
      minTeams: tournament.minTeams,
      maxTeams: tournament.maxTeams,
      status: tournament.status,
      createdBy: tournament.createdBy.toString(),
      createdAt: tournament.createdAt,
      updatedAt: tournament.updatedAt
    }
  }
}
