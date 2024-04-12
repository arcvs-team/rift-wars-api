import { type TeamPlayerInvite } from '@/domain/team/enterprise/entities/team-player-invite'

export class ApolloTeamPlayerInviteMapper {
  static toApollo (teamPlayerInvite: TeamPlayerInvite) {
    return {
      id: teamPlayerInvite.id.toString(),
      playerId: teamPlayerInvite.playerId.toString(),
      teamId: teamPlayerInvite.teamId.toString(),
      acceptedAt: teamPlayerInvite.acceptedAt,
      rejectedAt: teamPlayerInvite.rejectedAt,
      invitedAt: teamPlayerInvite.invitedAt,
      invitedBy: teamPlayerInvite.invitedBy.toString()
    }
  }
}
