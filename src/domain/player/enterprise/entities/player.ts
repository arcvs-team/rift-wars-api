import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface PlayerAttributes {
  email: string
  riotId: string
  riotPuuid: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export class Player extends Entity<PlayerAttributes> {
  get email () {
    return this.attributes.email
  }

  get riotId () {
    return this.attributes.riotId
  }

  get riotPuuid () {
    return this.attributes.riotPuuid
  }

  get password () {
    return this.attributes.password
  }

  get createdAt () {
    return this.attributes.createdAt
  }

  get updatedAt () {
    return this.attributes.updatedAt
  }

  static create (
    attributes: Optional<PlayerAttributes, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ) {
    const player = new Player(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date(),
        updatedAt: attributes.updatedAt ?? new Date()
      },
      id
    )

    return player
  }
}
