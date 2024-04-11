import { type HandleFinishedGameUseCase } from '@/domain/match/application/use-cases/handle-finished-game'
import { container } from '@/infra/container/inversify'
import { type Request, type Response } from 'express'

export class ExpressRiotGameResultController {
  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { startTime, shortCode, metaData, gameId, gameName, gameType, gameMap, gameMode, region } = request.body

      const handleFinishedGameUseCase: HandleFinishedGameUseCase = container.get('HandleFinishedGameUseCase')

      await handleFinishedGameUseCase.execute({
        startTime,
        shortCode,
        metaData,
        gameId,
        gameName,
        gameType,
        gameMap,
        gameMode,
        region
      })

      return response.status(201).send()
    } catch (err) {
      console.error(err)
      return response.status(500).json({ error: 'Internal server error' })
    }
  }
}
