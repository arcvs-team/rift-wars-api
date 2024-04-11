import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TeamPlayer } from '@/domain/team/enterprise/entities/team-player'
import { type DrizzleTeamPlayer } from '../schema'

export class DrizzleTeamPlayerMapper {
  static toDomain (raw: DrizzleTeamPlayer): TeamPlayer {
    return TeamPlayer.create(
      {
        playerId: new UniqueEntityID(raw.playerId),
        teamId: new UniqueEntityID(raw.teamId),
        isCaptain: raw.isCaptain,
        joinedAt: raw.joinedAt ?? undefined,
        removedAt: raw.removedAt ?? undefined,
        removedBy: raw.removedBy ? new UniqueEntityID(raw.removedBy) : undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (teamPlayer: TeamPlayer): DrizzleTeamPlayer {
    return {
      id: teamPlayer.id.toString(),
      playerId: teamPlayer.playerId.toString(),
      teamId: teamPlayer.teamId.toString(),
      isCaptain: teamPlayer.isCaptain,
      joinedAt: teamPlayer.joinedAt ?? null,
      removedAt: teamPlayer.removedAt ?? null,
      removedBy: teamPlayer.removedBy?.toString() ?? null
    }
  }
}
