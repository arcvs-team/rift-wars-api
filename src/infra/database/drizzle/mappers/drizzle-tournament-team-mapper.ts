import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TournamentTeam } from '@/domain/team/enterprise/entities/tournament-team'
import { type DrizzleTournamentTeam } from '../schema'

export class DrizzleTournamentTeamMapper {
  static toDomain (raw: DrizzleTournamentTeam): TournamentTeam {
    return TournamentTeam.create(
      {
        tournamentId: new UniqueEntityID(raw.tournamentId),
        teamId: new UniqueEntityID(raw.teamId),
        withdrawAt: raw.withdrawAt ?? undefined,
        withdrawReason: raw.withdrawReason ?? undefined,
        joinedAt: raw.joinedAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (player: TournamentTeam): DrizzleTournamentTeam {
    return {
      id: player.id.toString(),
      tournamentId: player.tournamentId.toString(),
      teamId: player.teamId.toString(),
      withdrawAt: player.withdrawAt ?? null,
      withdrawReason: player.withdrawReason ?? null,
      joinedAt: player.joinedAt ?? null
    }
  }
}
