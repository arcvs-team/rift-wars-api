import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { TournamentModel } from '../dtos/models/tournament.model'
import { type CreateTournamentUseCase } from '@/domain/application/use-cases/create-tournament'
import { type FetchTournamentsUseCase } from '@/domain/application/use-cases/fetch-tournaments'
import { container } from '@/infra/container/inversify'
import { ApolloTournamentMapper } from '../mappers/apollo-tournament-mapper'
import { GraphQLError } from 'graphql'
import { CreateTournamentInput } from '../dtos/inputs/create-tournament.input'
import { Player } from '@/domain/enterprise/player'

@Resolver(TournamentModel)
export class TournamentResolver {
  private readonly createTournamentUseCase: CreateTournamentUseCase
  private readonly fetchTournamentsUseCase: FetchTournamentsUseCase

  constructor () {
    this.createTournamentUseCase = container.get('CreateTournamentUseCase')
    this.fetchTournamentsUseCase = container.get('FetchTournamentsUseCase')
  }

  @Query(() => [TournamentModel])
  async tournament () {
    const result = await this.fetchTournamentsUseCase.execute()

    if (result.isRight()) {
      return result.value.tournaments.map(ApolloTournamentMapper.toApollo)
    }

    throw new GraphQLError('Internal server error.')
  }

  @Mutation(() => TournamentModel)
  async createTournament (@Arg('data') createTournamentInput: CreateTournamentInput, @Ctx() context: { player?: Player }) {
    if (!(context.player instanceof Player)) throw new GraphQLError('Unauthorized')

    const result = await this.createTournamentUseCase.execute({
      name: createTournamentInput.name,
      description: createTournamentInput.description,
      rules: createTournamentInput.rules,
      startDate: createTournamentInput.startDate,
      endDate: createTournamentInput.endDate,
      minTeams: createTournamentInput.minTeams,
      maxTeams: createTournamentInput.maxTeams,
      createdBy: context.player.id.toString()
    })

    if (result.isRight()) {
      return ApolloTournamentMapper.toApollo(result.value.tournament)
    }

    throw new GraphQLError('Internal server error.')
  }
}
