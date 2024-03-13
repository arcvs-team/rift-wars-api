import { Container } from 'inversify'
import { DrizzlePlayerRepository } from '../../database/drizzle/repositories/drizzle-player-repository'
import { DrizzleTeamRepository } from '@/infra/database/drizzle/repositories/drizzle-team-repository'
import { CreatePlayerUseCase } from '../../../domain/application/use-cases/create-player'
import { FetchPlayersUseCase } from '@/domain/application/use-cases/fetch-players'
import { FetchPlayerOwnedTeamsUseCase } from '@/domain/application/use-cases/fetch-player-owned-teams'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { AuthenticateUseCase } from '@/domain/application/use-cases/authenticate'
import { DrizzleTournamentRepository } from '@/infra/database/drizzle/repositories/drizzle-tournament-repository'
import { CreateTournamentUseCase } from '@/domain/application/use-cases/create-tournament'
import { FetchTournamentsUseCase } from '@/domain/application/use-cases/fetch-tournaments'
import { FetchPlayerByIdUseCase } from '@/domain/application/use-cases/fetch-player-by-id'

const container = new Container()

container.bind('PlayerRepository').to(DrizzlePlayerRepository)
container.bind('TeamRepository').to(DrizzleTeamRepository)
container.bind('TournamentRepository').to(DrizzleTournamentRepository)

container.bind('CreatePlayerUseCase').to(CreatePlayerUseCase)
container.bind('FetchPlayersUseCase').to(FetchPlayersUseCase)
container.bind('FetchPlayerOwnedTeamsUseCase').to(FetchPlayerOwnedTeamsUseCase)
container.bind('AuthenticateUseCase').to(AuthenticateUseCase)
container.bind('CreateTournamentUseCase').to(CreateTournamentUseCase)
container.bind('FetchTournamentsUseCase').to(FetchTournamentsUseCase)
container.bind('FetchPlayerByIdUseCase').to(FetchPlayerByIdUseCase)

container.bind('HashComparer').to(BcryptHasher)
container.bind('HashGenerator').to(BcryptHasher)
container.bind('Encrypter').to(JwtEncrypter)

export { container }
