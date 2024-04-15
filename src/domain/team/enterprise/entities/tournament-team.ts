import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TournamentTeamAttributes {
  tournamentId: UniqueEntityID
  teamId: UniqueEntityID
  joinedAt?: Date
  withdrawAt?: Date
}

export class TournamentTeam extends Entity<TournamentTeamAttributes> {
  get tournamentId () {
    return this.attributes.tournamentId
  }

  get teamId () {
    return this.attributes.teamId
  }

  get joinedAt () {
    return this.attributes.joinedAt
  }

  get withdrawAt () {
    return this.attributes.withdrawAt
  }

  static create (
    attributes: Optional<TournamentTeamAttributes, 'joinedAt' | 'withdrawAt'>,
    id?: UniqueEntityID
  ) {
    const tournamentTeam = new TournamentTeam(
      {
        ...attributes,
        joinedAt: attributes.joinedAt ?? new Date()
      },
      id
    )

    return tournamentTeam
  }
}
