import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DrizzleTeam } from '../schema'
import { Team } from '@/domain/enterprise/team'

export class DrizzleTeamMapper {
  static toDomain (raw: DrizzleTeam): Team {
    return Team.create(
      {
        name: raw.name,
        createdBy: new UniqueEntityID(raw.createdBy),
        createdAt: raw.createdAt ?? undefined,
        updatedAt: raw.updatedAt ?? undefined
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence (team: Team): DrizzleTeam {
    return {
      id: team.id.toString(),
      name: team.name,
      createdBy: team.createdBy.toString(),
      createdAt: team.createdAt ?? null,
      updatedAt: team.updatedAt ?? null
    }
  }
}
