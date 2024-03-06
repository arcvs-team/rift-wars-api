import { Query, Resolver } from 'type-graphql'
import { TeamModel } from '../dtos/models/team.model'
import { prisma } from '../../database/client'

@Resolver()
export class TeamResolver {
  @Query(() => [TeamModel])
  async team () {
    const teams = await prisma.team.findMany()

    return teams
  }
}
