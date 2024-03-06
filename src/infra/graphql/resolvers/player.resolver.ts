import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { prisma } from '../../database/client'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'
import { PlayerModel } from '../dtos/models/player.model'

@Resolver()
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
}
