import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TeamPlayerInviteAttributes {
  playerId: UniqueEntityID
  teamId: UniqueEntityID
  acceptedAt?: Date
  rejectedAt?: Date
  invitedAt?: Date
  invitedBy: UniqueEntityID
}

export class TeamPlayerInvite extends Entity<TeamPlayerInviteAttributes> {
  get playerId () {
    return this.attributes.playerId
  }

  get teamId () {
    return this.attributes.teamId
  }

  get acceptedAt () {
    return this.attributes.acceptedAt
  }

  get rejectedAt () {
    return this.attributes.rejectedAt
  }

  get invitedAt () {
    return this.attributes.invitedAt
  }

  get invitedBy () {
    return this.attributes.invitedBy
  }

  acceptInvite () {
    this.attributes.acceptedAt = new Date()
  }

  rejectInvite () {
    this.attributes.rejectedAt = new Date()
  }

  static create (attributes: Optional<TeamPlayerInviteAttributes, 'invitedAt' | 'acceptedAt' | 'rejectedAt'>, id?: UniqueEntityID): TeamPlayerInvite {
    const teamPlayerInvite = new TeamPlayerInvite(
      {
        ...attributes,
        invitedAt: new Date()
      },
      id
    )

    return teamPlayerInvite
  }
}
