import { Query, Resolver } from 'type-graphql'
import { TeamModel } from '../dtos/models/team.model'

@Resolver()
export class TeamResolver {
  @Query(() => [TeamModel])
  async team () {
    const teams = [] as TeamModel[]

    return teams
  }
}
