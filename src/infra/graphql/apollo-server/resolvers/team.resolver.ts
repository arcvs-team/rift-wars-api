import { Arg, Mutation, Query, Resolver, Ctx } from 'type-graphql'
import { TeamModel } from '../dtos/models/team.model'
import { type CreateTeamUseCase } from '@/domain/team/application/use-cases/create-team'
import { container } from '@/infra/container/inversify'
import { CreateTeamInput } from '../dtos/inputs/create-team.input'
import { Player } from '@/domain/player/enterprise/entities/player'
import { GraphQLError } from 'graphql'
import { ApolloTeamMapper } from '../mappers/apollo-team-mapper'

@Resolver()
export class TeamResolver {
  private readonly createTeamUseCase: CreateTeamUseCase

  constructor () {
    this.createTeamUseCase = container.get('CreateTeamUseCase')
  }

  @Query(() => [TeamModel])
  async team () {
    const teams = [] as TeamModel[]

    return teams
  }

  @Mutation(() => TeamModel)
  async createTeam (@Arg('data') createTeamInput: CreateTeamInput, @Ctx() context: { player?: Player }) {
    if (!(context.player instanceof Player)) throw new GraphQLError('Unauthorized')

    const result = await this.createTeamUseCase.execute({
      name: createTeamInput.name,
      createdBy: context.player.id.toString()
    })

    if (result.isRight()) {
      return ApolloTeamMapper.toApollo(result.value.team)
    }

    throw new GraphQLError('Internal server error.')
  }
}
