import { TeamPlayerInvite } from '@/domain/team/enterprise/entities/team-player-invite'
import { type DrizzleTeamPlayerInvite } from '../schema'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class DrizzleTeamPlayerInviteMapper {
  static toDomain (raw: DrizzleTeamPlayerInvite): TeamPlayerInvite {
    return TeamPlayerInvite.create(
      {
        playerId: new UniqueEntityID(raw.playerId),
        teamId: new UniqueEntityID(raw.teamId),
        acceptedAt: raw.acceptedAt ?? undefined,
        rejectedAt: raw.rejectedAt ?? undefined,
        invitedAt: raw.invitedAt ?? undefined,
        invitedBy: new UniqueEntityID(raw.invitedBy)
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (teamPlayerInvite: TeamPlayerInvite): DrizzleTeamPlayerInvite {
    return {
      id: teamPlayerInvite.id.toString(),
      playerId: teamPlayerInvite.playerId.toString(),
      teamId: teamPlayerInvite.teamId.toString(),
      acceptedAt: teamPlayerInvite.acceptedAt ?? null,
      rejectedAt: teamPlayerInvite.rejectedAt ?? null,
      invitedAt: teamPlayerInvite.invitedAt ?? null,
      invitedBy: teamPlayerInvite.invitedBy.toString()
    }
  }
}
