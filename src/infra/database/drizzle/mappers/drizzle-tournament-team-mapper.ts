import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TournamentTeam } from '@/domain/team/enterprise/entities/tournament-team'
import { type DrizzleTournamentTeam } from '../schema'

export class DrizzleTournamentTeamMapper {
  static toDomain (raw: DrizzleTournamentTeam): TournamentTeam {
    return TournamentTeam.create(
      {
        tournamentId: new UniqueEntityID(raw.tournamentId),
        teamId: new UniqueEntityID(raw.teamId),
        joinedAt: raw.joinedAt ?? undefined,
        withdrawAt: raw.withdrawAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (player: TournamentTeam): DrizzleTournamentTeam {
    return {
      id: player.id.toString(),
      tournamentId: player.tournamentId.toString(),
      teamId: player.teamId.toString(),
      joinedAt: player.joinedAt ?? null,
      withdrawAt: player.withdrawAt ?? null
    }
  }
}
