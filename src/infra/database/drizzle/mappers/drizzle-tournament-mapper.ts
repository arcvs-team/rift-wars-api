import { Tournament } from '@/domain/tournament/enterprise/entities/tournament'
import { type DrizzleTournament } from '../schema'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class DrizzleTournamentMapper {
  static toDomain (raw: DrizzleTournament): Tournament {
    return Tournament.create(
      {
        name: raw.name,
        providerId: new UniqueEntityID(raw.providerId),
        riotTournamentId: raw.riotTournamentId,
        description: raw.description ?? undefined,
        rules: raw.rules ?? undefined,
        startDate: raw.startDate ?? undefined,
        endDate: raw.endDate ?? undefined,
        winnerTeamId: raw.winnerTeamId !== null ? new UniqueEntityID(raw.winnerTeamId) : undefined,
        maxTeams: raw.maxTeams ?? undefined,
        minTeams: raw.minTeams ?? undefined,
        stages: raw.stages ?? undefined,
        status: raw.status ?? undefined,
        createdBy: new UniqueEntityID(raw.createdBy),
        createdAt: raw.createdAt ?? undefined,
        updatedAt: raw.updatedAt ?? undefined,
        canceledAt: raw.canceledAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (tournament: Tournament): DrizzleTournament {
    return {
      id: tournament.id.toString(),
      name: tournament.name,
      providerId: tournament.providerId.toString(),
      riotTournamentId: tournament.riotTournamentId,
      description: tournament.description ?? null,
      rules: tournament.rules ?? null,
      startDate: tournament.startDate ?? null,
      endDate: tournament.endDate ?? null,
      winnerTeamId: tournament.winnerTeamId?.toString() ?? null,
      maxTeams: tournament.maxTeams ?? null,
      minTeams: tournament.minTeams ?? null,
      stages: tournament.stages ?? null,
      status: tournament.status,
      createdBy: tournament.createdBy.toString(),
      createdAt: tournament.createdAt ?? null,
      updatedAt: tournament.updatedAt ?? null,
      canceledAt: tournament.canceledAt ?? null
    }
  }
}
