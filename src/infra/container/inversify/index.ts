import { Container } from 'inversify'
import { DrizzlePlayerRepository } from '../../database/drizzle/repositories/drizzle-player-repository'
import { CreatePlayerUseCase } from '../../../domain/application/use-cases/create-player'

const container = new Container()

container.bind('PlayerRepository').to(DrizzlePlayerRepository)
container.bind('CreatePlayerUseCase').to(CreatePlayerUseCase)

export { container }
