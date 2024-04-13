import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TournamentStageAttributes {
  tournamentId: UniqueEntityID
  stage: number
  createdAt?: Date
  finishedAt?: Date
}

export class TournamentStage extends Entity<TournamentStageAttributes> {
  get tournamentId () {
    return this.attributes.tournamentId
  }

  get stage () {
    return this.attributes.stage
  }

  get createdAt () {
    return this.attributes.createdAt
  }

  get finishedAt () {
    return this.attributes.finishedAt
  }

  static create (
    attributes: Optional<TournamentStageAttributes, 'createdAt' | 'finishedAt'>,
    id?: UniqueEntityID
  ) {
    const team = new TournamentStage(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date()
      },
      id
    )

    return team
  }
}
