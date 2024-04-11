import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface RiotTournamentProviderAttributes {
  providerId: number
  region: string
  url: string
  isActive: boolean
  createdAt?: Date
}

export class RiotTournamentProvider extends Entity<RiotTournamentProviderAttributes> {
  get providerId () {
    return this.attributes.providerId
  }

  get region () {
    return this.attributes.region
  }

  get url () {
    return this.attributes.url
  }

  get isActive () {
    return this.attributes.isActive
  }

  get createdAt () {
    return this.attributes.createdAt
  }

  static create (
    attributes: Optional<RiotTournamentProviderAttributes, 'isActive' | 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const riotTournamentProvider = new RiotTournamentProvider(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date(),
        isActive: attributes.isActive ?? false
      },
      id
    )

    return riotTournamentProvider
  }
}
