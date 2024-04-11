import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { RiotApiServices } from '@/infra/riot/riot-api-services'
import { inject, injectable } from 'inversify'

interface HandleFinishedGameParams {
  startTime: number
  shortCode: string
  metaData: string
  gameId: number
  gameName: string
  gameType: string
  gameMap: number
  gameMode: string
  region: string
}

type HandleFinishedGameResult = Either<null, null>

@injectable()
export class HandleFinishedGameUseCase implements UseCase {
  constructor (
    @inject('RiotApiServices')
    private readonly riotApiServices: RiotApiServices
  ) {}

  async execute ({ gameId }: HandleFinishedGameParams): Promise<HandleFinishedGameResult> {
    // save riot game data
    // fetch game result
    // update game result
    return right(null)
  }
}
