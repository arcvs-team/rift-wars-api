import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Match } from '@/domain/match/enterprise/entities/match'
import { type DrizzleMatch } from '../schema'

export class DrizzleMatchMapper {
  static toDomain (raw: DrizzleMatch): Match {
    return Match.create(
      {
        tournamentId: new UniqueEntityID(raw.tournamentId),
        tournamentStageId: new UniqueEntityID(raw.tournamentStageId),
        riotTournamentCode: raw.riotTournamentCode,
        blueTeamId: new UniqueEntityID(raw.blueTeamId),
        redTeamId: raw.redTeamId ? new UniqueEntityID(raw.redTeamId) : undefined,
        blueTeamScore: raw.blueTeamScore ?? undefined,
        redTeamScore: raw.redTeamScore ?? undefined,
        riotMatchId: raw.riotMatchId ?? undefined,
        winnerTeamId: raw.winnerTeamId ? new UniqueEntityID(raw.winnerTeamId) : undefined,
        winCondition: raw.winCondition ?? undefined,
        createdAt: raw.createdAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (team: Match): DrizzleMatch {
    return {
      id: team.id.toString(),
      tournamentId: team.tournamentId.toString(),
      tournamentStageId: team.tournamentStageId.toString(),
      riotTournamentCode: team.riotTournamentCode,
      blueTeamId: team.blueTeamId.toString(),
      redTeamId: team.redTeamId ? team.redTeamId.toString() : null,
      blueTeamScore: team.blueTeamScore ?? null,
      redTeamScore: team.redTeamScore ?? null,
      riotMatchId: team.riotMatchId ?? null,
      winnerTeamId: team.winnerTeamId?.toString() ?? null,
      winCondition: team.winCondition ?? null,
      createdAt: team.createdAt ?? null
    }
  }
}
