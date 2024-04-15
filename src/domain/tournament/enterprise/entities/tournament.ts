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
  status: 'draft' | 'public' | 'started' | 'finished'
  createdBy: UniqueEntityID
  createdAt?: Date
  updatedAt?: Date
  canceledAt?: Date
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

  set status (status) {
    this.attributes.status = status
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

  get canceledAt () {
    return this.attributes.canceledAt
  }

  set canceledAt (date) {
    this.attributes.canceledAt = date
  }

  hasStarted () {
    return this.status === 'started'
  }

  hasEnded () {
    return this.status === 'finished'
  }

  isCanceled () {
    return this.status === 'finished' && !!this.canceledAt
  }

  start () {
    this.status = 'started'
  }

  cancel () {
    this.canceledAt = new Date()
    this.status = 'finished'
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
