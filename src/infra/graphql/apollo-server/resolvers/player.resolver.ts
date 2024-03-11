import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'
import { PlayerModel } from '../dtos/models/player.model'
import { TeamModel } from '../dtos/models/team.model'
import { container } from '@/infra/container/inversify'
import { CreatePlayerUseCase } from '@/domain/application/use-cases/create-player'
import { ApolloPlayerMapper } from '../mappers/apollo-player-mapper'
import { GraphQLError } from 'graphql'
import { FetchPlayersUseCase } from '@/domain/application/use-cases/fetch-players'

@Resolver(PlayerModel)
export class PlayerResolver {
  constructor (
    private readonly createPlayerUseCase: CreatePlayerUseCase,
    private readonly fetchPlayersUseCase: FetchPlayersUseCase
  ) {
    this.createPlayerUseCase = container.get('CreatePlayerUseCase')
    this.fetchPlayersUseCase = container.get('FetchPlayersUseCase')
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
      riotId: createPlayerInput.riotId
    })

    if (result.isRight()) {
      return ApolloPlayerMapper.toApollo(result.value.player)
    }

    throw new GraphQLError(result.value.message)
  }

  @FieldResolver(() => [TeamModel])
  async ownedTeams (@Root() player: PlayerModel) {
    const teams = [] as TeamModel[]

    return teams
  }
}
