import { type TournamentTeam } from '../../enterprise/entities/tournament-team'

export interface TournamentTeamRepository {
  findManyByTournamentId: (tournamentId: string) => Promise<TournamentTeam[]>
  create: (tournamentTeam: TournamentTeam) => Promise<void>
}
