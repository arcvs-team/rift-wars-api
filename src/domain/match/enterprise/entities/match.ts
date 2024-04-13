import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface MatchAttributes {
  tournamentId: UniqueEntityID
  tournamentStageId: UniqueEntityID
  riotTournamentCode: string
  blueTeamId: UniqueEntityID
  redTeamId: UniqueEntityID
  blueTeamScore?: number
  redTeamScore?: number
  riotMatchId?: string
  winnerTeamId?: UniqueEntityID
  winCondition?: 'normal' | 'wo' | 'ff'
  createdAt?: Date
}

export class Match extends Entity<MatchAttributes> {
  get tournamentId () {
    return this.attributes.tournamentId
  }

  get tournamentStageId () {
    return this.attributes.tournamentStageId
  }

  get riotTournamentCode () {
    return this.attributes.riotTournamentCode
  }

  get blueTeamId () {
    return this.attributes.blueTeamId
  }

  get redTeamId () {
    return this.attributes.redTeamId
  }

  get blueTeamScore () {
    return this.attributes.blueTeamScore
  }

  get redTeamScore () {
    return this.attributes.redTeamScore
  }

  get riotMatchId () {
    return this.attributes.riotMatchId
  }

  get winnerTeamId () {
    return this.attributes.winnerTeamId
  }

  get winCondition () {
    return this.attributes.winCondition
  }

  get createdAt () {
    return this.attributes.createdAt
  }

  hasEnded () {
    return !!this.winnerTeamId
  }

  static create (
    attributes: Optional<MatchAttributes, 'createdAt' | 'blueTeamScore' | 'redTeamScore' | 'riotMatchId' | 'winnerTeamId' | 'winCondition'>,
    id?: UniqueEntityID
  ) {
    const match = new Match(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date(),
        blueTeamScore: attributes.blueTeamScore ?? 0,
        redTeamScore: attributes.redTeamScore ?? 0,
        riotMatchId: attributes.riotMatchId ?? undefined,
        winnerTeamId: attributes.winnerTeamId ?? undefined,
        winCondition: attributes.winCondition ?? undefined
      },
      id
    )

    return match
  }
}
