import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TournamentTeamAttributes {
  tournamentId: UniqueEntityID
  teamId: UniqueEntityID
  withdrawAt?: Date
  withdrawReason?: 'team_left_tournament' | 'player_left_team'
  joinedAt?: Date
}

export class TournamentTeam extends Entity<TournamentTeamAttributes> {
  get tournamentId () {
    return this.attributes.tournamentId
  }

  get teamId () {
    return this.attributes.teamId
  }

  get withdrawAt () {
    return this.attributes.withdrawAt
  }

  get withdrawReason () {
    return this.attributes.withdrawReason
  }

  get joinedAt () {
    return this.attributes.joinedAt
  }

  static create (
    attributes: Optional<TournamentTeamAttributes, 'joinedAt'>,
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
