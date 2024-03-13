import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'
import { PlayerModel } from '../dtos/models/player.model'
import { TeamModel } from '../dtos/models/team.model'
import { container } from '@/infra/container/inversify'
import { type CreatePlayerUseCase } from '@/domain/application/use-cases/create-player'
import { ApolloPlayerMapper } from '../mappers/apollo-player-mapper'
import { GraphQLError } from 'graphql'
import { type FetchPlayersUseCase } from '@/domain/application/use-cases/fetch-players'
import { type FetchPlayerOwnedTeamsUseCase } from '@/domain/application/use-cases/fetch-player-owned-teams'
import { ApolloTeamMapper } from '../mappers/apollo-team-mapper'
import { AccessTokenModel } from '../dtos/models/access-token.model'
import { type AuthenticateUseCase } from '@/domain/application/use-cases/authenticate'
import { AuthenticateInput } from '../dtos/inputs/authenticate.input'

@Resolver(PlayerModel)
export class PlayerResolver {
  private readonly createPlayerUseCase: CreatePlayerUseCase
  private readonly fetchPlayersUseCase: FetchPlayersUseCase
  private readonly fetchPlayerOwnedTeamsUseCase: FetchPlayerOwnedTeamsUseCase
  private readonly authenticate: AuthenticateUseCase

  constructor () {
    this.createPlayerUseCase = container.get('CreatePlayerUseCase')
    this.fetchPlayersUseCase = container.get('FetchPlayersUseCase')
    this.fetchPlayerOwnedTeamsUseCase = container.get('FetchPlayerOwnedTeamsUseCase')
    this.authenticate = container.get('AuthenticateUseCase')
  }

  @Query(() => AccessTokenModel)
  async auth (@Arg('data') authenticateInput: AuthenticateInput) {
    const result = await this.authenticate.execute({
      email: authenticateInput.email,
      password: authenticateInput.password
    })

    if (result.isRight()) {
      return {
        accessToken: result.value.accessToken
      }
    }

    throw new GraphQLError(result.value.message ?? 'Internal server error.')
  }

  @Query(() => [PlayerModel])
  async player () {
    const result = await this.fetchPlayersUseCase.execute()

    if (result.isRight()) {
      return result.value.players.map(ApolloPlayerMapper.toApollo)
    }

    throw new GraphQLError('Internal server error.')
  }

  @Mutation(() => PlayerModel)
  async createPlayer (@Arg('data') createPlayerInput: CreatePlayerInput) {
    const result = await this.createPlayerUseCase.execute({
      email: createPlayerInput.email,
      riotId: createPlayerInput.riotId,
      password: createPlayerInput.password
    })

    if (result.isRight()) {
      return ApolloPlayerMapper.toApollo(result.value.player)
    }

    throw new GraphQLError(result.value.message ?? 'Internal server error.')
  }

  @FieldResolver(() => [TeamModel])
  async ownedTeams (@Root() player: PlayerModel) {
    const result = await this.fetchPlayerOwnedTeamsUseCase.execute({ playerId: player.id })

    if (result.isRight()) {
      return result.value.teams.map(ApolloTeamMapper.toApollo)
    }

    throw new GraphQLError('Internal server error.')
  }
}
