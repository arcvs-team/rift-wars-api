import { type TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'

export interface TeamPlayerInviteRepository {
  findByPlayerIdAndTeamId: (playerId: string, teamId: string) => Promise<TeamPlayerInvite | null>
  findManyOpenByPlayerId: (playerId: string) => Promise<TeamPlayerInvite[]>
  create: (teamPlayerInvite: TeamPlayerInvite) => Promise<void>
}
