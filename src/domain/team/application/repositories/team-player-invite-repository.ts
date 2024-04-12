import { type TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'

export interface TeamPlayerInviteRepository {
  findById: (id: string) => Promise<TeamPlayerInvite | null>
  findByPlayerIdAndTeamId: (playerId: string, teamId: string) => Promise<TeamPlayerInvite | null>
  findManyOpenByPlayerId: (playerId: string) => Promise<TeamPlayerInvite[]>
  save: (teamPlayerInvite: TeamPlayerInvite) => Promise<void>
  create: (teamPlayerInvite: TeamPlayerInvite) => Promise<void>
}
