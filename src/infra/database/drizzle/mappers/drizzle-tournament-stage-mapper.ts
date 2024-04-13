import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DrizzleTournamentStage } from '../schema'
import { TournamentStage } from '@/domain/tournament/enterprise/entities/tournament-stage'

export class DrizzleTournamentStageMapper {
  static toDomain (raw: DrizzleTournamentStage): TournamentStage {
    return TournamentStage.create(
      {
        tournamentId: new UniqueEntityID(raw.tournamentId),
        stage: raw.stage,
        createdAt: raw.createdAt ?? undefined,
        finishedAt: raw.finishedAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (team: TournamentStage): DrizzleTournamentStage {
    return {
      id: team.id.toString(),
      tournamentId: team.tournamentId.toString(),
      stage: team.stage,
      createdAt: team.createdAt ?? null,
      finishedAt: team.finishedAt ?? null
    }
  }
}
