import { Container } from 'inversify'
import { DrizzlePlayerRepository } from '../../database/drizzle/repositories/drizzle-player-repository'
import { DrizzleTeamRepository } from '@/infra/database/drizzle/repositories/drizzle-team-repository'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { DrizzleTournamentRepository } from '@/infra/database/drizzle/repositories/drizzle-tournament-repository'
import { CreatePlayerUseCase } from '@/domain/player/application/use-cases/create-player'
import { FetchPlayersUseCase } from '@/domain/player/application/use-cases/fetch-players'
import { FetchPlayerOwnedTeamsUseCase } from '@/domain/team/application/use-cases/fetch-player-owned-teams'
import { AuthenticateUseCase } from '@/domain/player/application/use-cases/authenticate'
import { CreateTournamentUseCase } from '@/domain/tournament/application/use-cases/create-tournament'
import { FetchTournamentsUseCase } from '@/domain/tournament/application/use-cases/fetch-tournaments'
import { FetchPlayerByIdUseCase } from '@/domain/player/application/use-cases/fetch-player-by-id'
import { CreateTeamUseCase } from '@/domain/team/application/use-cases/create-team'
import { FetchTeamsUseCase } from '@/domain/team/application/use-cases/fetch-teams'
import { AxiosHttpClient } from '@/infra/http-client/axios/axios-http-client'
import { RiotApiServices } from '@/infra/riot/riot-api-services'
import { DrizzleRiotGameResultRepository } from '@/infra/database/drizzle/repositories/drizzle-riot-game-result-repository'
import { HandleFinishedGameUseCase } from '@/domain/match/application/use-cases/handle-finished-game'
import { DrizzleRiotTournamentProviderRepository } from '@/infra/database/drizzle/repositories/drizzle-riot-tournament-provider-repository'
import { DrizzleTeamPlayerRepository } from '@/infra/database/drizzle/repositories/drizzle-team-player-repository'
import { DrizzleTeamPlayerInviteRepository } from '@/infra/database/drizzle/repositories/drizzle-team-player-invite-repository'
import { InvitePlayerToTeamUseCase } from '@/domain/team/application/use-cases/invite-player-to-team'

const container = new Container()

container.bind('PlayerRepository').to(DrizzlePlayerRepository)
container.bind('TeamRepository').to(DrizzleTeamRepository)
container.bind('TournamentRepository').to(DrizzleTournamentRepository)
container.bind('TeamPlayerRepository').to(DrizzleTeamPlayerRepository)
container.bind('TeamPlayerInviteRepository').to(DrizzleTeamPlayerInviteRepository)
container.bind('RiotGameResultRepository').to(DrizzleRiotGameResultRepository)
container.bind('RiotTournamentProviderRepository').to(DrizzleRiotTournamentProviderRepository)

container.bind('CreatePlayerUseCase').to(CreatePlayerUseCase)
container.bind('FetchPlayersUseCase').to(FetchPlayersUseCase)
container.bind('FetchPlayerOwnedTeamsUseCase').to(FetchPlayerOwnedTeamsUseCase)
container.bind('AuthenticateUseCase').to(AuthenticateUseCase)
container.bind('CreateTournamentUseCase').to(CreateTournamentUseCase)
container.bind('FetchTournamentsUseCase').to(FetchTournamentsUseCase)
container.bind('FetchPlayerByIdUseCase').to(FetchPlayerByIdUseCase)
container.bind('CreateTeamUseCase').to(CreateTeamUseCase)
container.bind('FetchTeamsUseCase').to(FetchTeamsUseCase)
container.bind('HandleFinishedGameUseCase').to(HandleFinishedGameUseCase)
container.bind('InvitePlayerToTeamUseCase').to(InvitePlayerToTeamUseCase)

container.bind('HashComparer').to(BcryptHasher)
container.bind('HashGenerator').to(BcryptHasher)
container.bind('Encrypter').to(JwtEncrypter)
container.bind('HttpClient').to(AxiosHttpClient)

container.bind('FetchMatch').to(RiotApiServices)
container.bind('CreateTournament').to(RiotApiServices)

export { container }
