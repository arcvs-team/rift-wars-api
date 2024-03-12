import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '../../core/entities/entity'
import { type Optional } from '../../core/types/optional'

export interface TeamAttributes {
  name: string
  createdBy: UniqueEntityID
  createdAt?: Date
  updatedAt?: Date
}

export class Team extends Entity<TeamAttributes> {
  get name () {
    return this.attributes.name
  }

  get createdBy () {
    return this.attributes.createdBy
  }

  get createdAt () {
    return this.attributes.createdAt
  }

  get updatedAt () {
    return this.attributes.updatedAt
  }

  static create (
    attributes: Optional<TeamAttributes, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ) {
    const team = new Team(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date(),
        updatedAt: attributes.updatedAt ?? new Date()
      },
      id
    )

    return team
  }
}
