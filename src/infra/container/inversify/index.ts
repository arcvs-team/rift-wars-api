import { Container } from 'inversify'
import { DrizzlePlayerRepository } from '../../database/drizzle/repositories/drizzle-player-repository'
import { DrizzleTeamRepository } from '@/infra/database/drizzle/repositories/drizzle-team-repository'
import { CreatePlayerUseCase } from '../../../domain/application/use-cases/create-player'
import { FetchPlayersUseCase } from '@/domain/application/use-cases/fetch-players'
import { FetchPlayerOwnedTeamsUseCase } from '@/domain/application/use-cases/fetch-player-owned-teams'

const container = new Container()

container.bind('PlayerRepository').to(DrizzlePlayerRepository)
container.bind('TeamRepository').to(DrizzleTeamRepository)

container.bind('CreatePlayerUseCase').to(CreatePlayerUseCase)
container.bind('FetchPlayersUseCase').to(FetchPlayersUseCase)
container.bind('FetchPlayerOwnedTeamsUseCase').to(FetchPlayerOwnedTeamsUseCase)

export { container }
