import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TeamPlayerAttributes {
  playerId: UniqueEntityID
  teamId: UniqueEntityID
  isCaptain: boolean
  joinedAt?: Date
  removedAt?: Date
  removedBy?: UniqueEntityID
}

export class TeamPlayer extends Entity<TeamPlayerAttributes> {
  get playerId () {
    return this.attributes.playerId
  }

  get teamId () {
    return this.attributes.teamId
  }

  get isCaptain () {
    return this.attributes.isCaptain
  }

  get joinedAt () {
    return this.attributes.joinedAt
  }

  get removedAt () {
    return this.attributes.removedAt
  }

  get removedBy () {
    return this.attributes.removedBy
  }

  leaveTeam () {
    this.attributes.removedAt = new Date()
    this.attributes.removedBy = this.attributes.playerId
  }

  static create (
    attributes: Optional<TeamPlayerAttributes, 'joinedAt' | 'removedAt' | 'removedBy'>,
    id?: UniqueEntityID
  ) {
    const teamPlayer = new TeamPlayer(
      {
        ...attributes,
        joinedAt: attributes.joinedAt ?? new Date()
      },
      id
    )

    return teamPlayer
  }
}
