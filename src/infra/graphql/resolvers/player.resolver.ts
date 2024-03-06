import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { prisma } from '../../database/client'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'
import { PlayerModel } from '../dtos/models/player.model'
import { TeamModel } from '../dtos/models/team.model'

@Resolver(PlayerModel)
export class PlayerResolver {
  @Query(() => [PlayerModel])
  async player () {
    const players = await prisma.player.findMany()

    return players
  }

  @Mutation(() => PlayerModel)
  async createPlayer (@Arg('data') createPlayerInput: CreatePlayerInput) {
    const player = await prisma.player.create({
      data: {
        email: createPlayerInput.email,
        riotId: createPlayerInput.riotId
      }
    })

    return player
  }

  @FieldResolver(() => [TeamModel])
  async ownedTeams (@Root() player: PlayerModel) {
    const teams = await prisma.team.findMany({
      where: {
        createdBy: player.id
      }
    })

    return teams
  }
}
