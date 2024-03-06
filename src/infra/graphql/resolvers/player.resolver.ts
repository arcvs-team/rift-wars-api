import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { FetchPlayersModel } from '../dtos/models/fetch-players.model'
import { prisma } from '../../database/client'
import { CreatePlayerInput } from '../dtos/inputs/create-player.input'

@Resolver()
export class PlayerResolver {
  @Query(() => [FetchPlayersModel])
  async player () {
    const players = await prisma.player.findMany()

    return players
  }

  @Mutation(() => FetchPlayersModel)
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
