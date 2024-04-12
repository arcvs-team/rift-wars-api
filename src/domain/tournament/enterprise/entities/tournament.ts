import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TournamentAttributes {
  name: string
  providerId: UniqueEntityID
  riotTournamentId: number
  description?: string
  rules?: string
  startDate?: Date
  endDate?: Date
  winnerTeamId?: UniqueEntityID
  minTeams?: number
  maxTeams?: number
  stages?: number
  status: 'draft' | 'public' | 'finished'
  createdBy: UniqueEntityID
  createdAt?: Date
  updatedAt?: Date
}

export class Tournament extends Entity<TournamentAttributes> {
  get name () {
    return this.attributes.name
  }

  get providerId () {
    return this.attributes.providerId
  }

  get riotTournamentId () {
    return this.attributes.riotTournamentId
  }

  get description () {
    return this.attributes.description
  }

  get rules () {
    return this.attributes.rules
  }

  get startDate () {
    return this.attributes.startDate
  }

  get endDate () {
    return this.attributes.endDate
  }

  get winnerTeamId () {
    return this.attributes.winnerTeamId
  }

  get minTeams () {
    return this.attributes.minTeams
  }

  get maxTeams () {
    return this.attributes.maxTeams
  }

  get stages () {
    return this.attributes.stages
  }

  get status () {
    return this.attributes.status
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
    attributes: Optional<TournamentAttributes, 'description' | 'rules' | 'startDate' | 'endDate' | 'winnerTeamId' | 'minTeams' | 'maxTeams' | 'status' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ) {
    const team = new Tournament(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date(),
        updatedAt: attributes.updatedAt ?? new Date(),
        status: attributes.status ?? 'draft'
      },
      id
    )

    return team
  }
}
