import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'
import { PlayerModel } from '../dtos/models/player.model'
import { TeamModel } from '../dtos/models/team.model'

@Resolver(PlayerModel)
export class PlayerResolver {
  @Query(() => [PlayerModel])
  async player () {
    const players = [] as PlayerModel[]

    return players
  }

  @Mutation(() => PlayerModel)
  async createPlayer (@Arg('data') createPlayerInput: CreatePlayerInput) {
    const player: PlayerModel = {
      id: 1,
      email: createPlayerInput.email,
      riotId: createPlayerInput.riotId,
      createdAt: new Date(),
      ownedTeams: []
    }

    return player
  }

  @FieldResolver(() => [TeamModel])
  async ownedTeams (@Root() player: PlayerModel) {
    const teams = [] as TeamModel[]

    return teams
  }
}
