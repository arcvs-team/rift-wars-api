import { Tournament } from '@/domain/enterprise/tournament'
import { type DrizzleTournament } from '../schema'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class DrizzleTournamentMapper {
  static toDomain (raw: DrizzleTournament): Tournament {
    return Tournament.create({
      name: raw.name,
      description: raw.description ?? undefined,
      rules: raw.rules ?? undefined,
      startDate: raw.startDate ?? undefined,
      endDate: raw.endDate ?? undefined,
      winnerTeamId: raw.winnerTeamId !== null ? new UniqueEntityID(raw.winnerTeamId) : undefined,
      maxTeams: raw.maxTeams ?? undefined,
      minTeams: raw.minTeams ?? undefined,
      status: raw.status ?? undefined,
      createdBy: new UniqueEntityID(raw.createdBy),
      createdAt: raw.createdAt ?? undefined,
      updatedAt: raw.updatedAt ?? undefined
    })
  }

  static toPersistence (tournament: Tournament): DrizzleTournament {
    return {
      id: tournament.id.toString(),
      name: tournament.name,
      description: tournament.description ?? null,
      rules: tournament.rules ?? null,
      startDate: tournament.startDate ?? null,
      endDate: tournament.endDate ?? null,
      winnerTeamId: tournament.winnerTeamId?.toString() ?? null,
      maxTeams: tournament.maxTeams ?? null,
      minTeams: tournament.minTeams ?? null,
      status: tournament.status,
      createdBy: tournament.createdBy.toString(),
      createdAt: tournament.createdAt ?? null,
      updatedAt: tournament.updatedAt ?? null
    }
  }
}
