import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'
import { PlayerModel } from '../dtos/models/player.model'
import { TeamModel } from '../dtos/models/team.model'
import { container } from '@/infra/container/inversify'
import { CreatePlayerUseCase } from '@/domain/application/use-cases/create-player'
import { ApolloPlayerMapper } from '../mappers/apollo-player-mapper'

@Resolver(PlayerModel)
export class PlayerResolver {
  constructor (
    private readonly createPlayerUseCase: CreatePlayerUseCase
  ) {
    this.createPlayerUseCase = container.get('CreatePlayerUseCase')
  }

  @Query(() => [PlayerModel])
  async player () {
    const players = [] as PlayerModel[]

    return players
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

    return {
      error: result.value.message
    }
  }

  @FieldResolver(() => [TeamModel])
  async ownedTeams (@Root() player: PlayerModel) {
    const teams = [] as TeamModel[]

    return teams
  }
}
