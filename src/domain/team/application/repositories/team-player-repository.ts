import { type TeamPlayer } from '../../enterprise/entities/team-player'

export interface TeamPlayerRepository {
  findByPlayerIdAndTeamId: (playerId: string, teamId: string) => Promise<TeamPlayer | null>
  findManyByTeamId: (teamId: string) => Promise<TeamPlayer[]>
  create: (teamPlayer: TeamPlayer) => Promise<void>
}
