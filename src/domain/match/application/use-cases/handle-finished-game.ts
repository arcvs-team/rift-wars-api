import 'reflect-metadata'
import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { RiotGameResultRepository } from '../repositories/riot-game-result-repository'
import { RiotGameResult } from '../../enterprise/entities/riot-game-result'
import { RiotApi } from '@/infra/riot/riot-api'
import { type FinishedMatchData } from '@/infra/riot/models/finished-match-data'

interface HandleFinishedGameParams extends FinishedMatchData {}

type HandleFinishedGameResult = Either<null, null>

@injectable()
export class HandleFinishedGameUseCase implements UseCase {
  constructor (
    @inject('RiotGameResultRepository')
    private readonly riotGameResultRepository: RiotGameResultRepository,

    @inject('RiotApi')
    private readonly riotApi: RiotApi
  ) {}

  async execute (params: HandleFinishedGameParams): Promise<HandleFinishedGameResult> {
    const riotGameResult = RiotGameResult.create(params)
    await this.riotGameResultRepository.create(riotGameResult)

    const matchData = await this.riotApi.fetchMatch(riotGameResult.matchId)
    console.log(JSON.stringify(matchData))
    return right(null)
  }
}
