import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface RiotGameResultAttributes {
  startTime: number
  shortCode: string
  metadata?: string
  gameId: number
  gameName: string
  gameType: string
  gameMap: number
  gameMode: string
  region: string
  createdAt: Date
}

export class RiotGameResult extends Entity<RiotGameResultAttributes> {
  get startTime () {
    return this.attributes.startTime
  }

  get shortCode () {
    return this.attributes.shortCode
  }

  get metadata () {
    return this.attributes.metadata
  }

  get gameId () {
    return this.attributes.gameId
  }

  get gameName () {
    return this.attributes.gameName
  }

  get gameType () {
    return this.attributes.gameType
  }

  get gameMap () {
    return this.attributes.gameMap
  }

  get gameMode () {
    return this.attributes.gameMode
  }

  get region () {
    return this.attributes.region
  }

  get createdAt () {
    return this.attributes.createdAt
  }

  static create (
    attributes: Optional<RiotGameResultAttributes, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const riotGameResult = new RiotGameResult(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date()
      },
      id
    )

    return riotGameResult
  }
}
