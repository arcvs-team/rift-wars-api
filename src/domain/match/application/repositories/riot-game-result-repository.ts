import { type RiotGameResult } from '../../enterprise/entities/riot-game-result'

export interface RiotGameResultRepository {
  create: (riotGameResult: RiotGameResult) => Promise<void>
}
