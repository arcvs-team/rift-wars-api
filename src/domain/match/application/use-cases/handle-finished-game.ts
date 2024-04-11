import 'reflect-metadata'
import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { RiotGameResultRepository } from '../repositories/riot-game-result-repository'
import { RiotGameResult } from '../../enterprise/entities/riot-game-result'
import { FetchMatch } from '@/domain/tournament/application/riot/fetch-match'
import { type FinishedMatchData } from '@/domain/tournament/models/finished-match-data'

interface HandleFinishedGameParams extends FinishedMatchData {}

type HandleFinishedGameResult = Either<null, null>

@injectable()
export class HandleFinishedGameUseCase implements UseCase {
  constructor (
    @inject('RiotGameResultRepository')
    private readonly riotGameResultRepository: RiotGameResultRepository,

    @inject('FetchMatch')
    private readonly fetchMatchService: FetchMatch
  ) {}

  async execute (params: HandleFinishedGameParams): Promise<HandleFinishedGameResult> {
    const riotGameResult = RiotGameResult.create(params)
    await this.riotGameResultRepository.create(riotGameResult)

    const matchData = await this.fetchMatchService.fetchMatch(riotGameResult.matchId)
    console.log(JSON.stringify(matchData))
    return right(null)
  }
}
