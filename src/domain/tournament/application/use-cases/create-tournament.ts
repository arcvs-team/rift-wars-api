import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { TournamentRepository } from '../repositories/tournament-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Either, right, left } from '@/core/either'
import { Tournament } from '../../enterprise/entities/tournament'
import { type UseCase } from '@/core/protocols/use-case'
import { RiotTournamentProviderRepository } from '../repositories/riot-tournament-provider-repository'
import { ActiveRiotTournamentProviderNotFoundError } from '@/domain/tournament/application/use-cases/errors/active-riot-tournament-provider-not-found.error'
import { CreateTournament } from '../riot/create-tournament'

interface CreateTournamentParams {
  name: string
  description?: string
  rules?: string
  startDate?: Date
  endDate?: Date
  minTeams?: number
  maxTeams?: number
  createdBy: string
}

type CreateTournamentResult = Either<ActiveRiotTournamentProviderNotFoundError, {
  tournament: Tournament
}>

@injectable()
export class CreateTournamentUseCase implements UseCase {
  constructor (
    @inject('RiotTournamentProviderRepository')
    private readonly riotTournamentProviderRepository: RiotTournamentProviderRepository,

    @inject('CreateTournament')
    private readonly createTournamentService: CreateTournament,

    @inject('TournamentRepository')
    private readonly tournamentRepository: TournamentRepository
  ) {}

  async execute ({
    name,
    description,
    rules,
    startDate,
    endDate,
    minTeams,
    maxTeams,
    createdBy
  }: CreateTournamentParams): Promise<CreateTournamentResult> {
    const activeRiotTournamentProvider = await this.riotTournamentProviderRepository.findActiveProvider()

    if (!activeRiotTournamentProvider) {
      return left(new ActiveRiotTournamentProviderNotFoundError())
    }

    const riotTournamentId = await this.createTournamentService.createTournament({
      name,
      providerId: activeRiotTournamentProvider.providerId
    })

    const tournament = Tournament.create({
      name,
      providerId: activeRiotTournamentProvider.id,
      riotTournamentId,
      description,
      rules,
      startDate,
      endDate,
      minTeams,
      maxTeams,
      createdBy: new UniqueEntityID(createdBy)
    })

    await this.tournamentRepository.create(tournament)

    return right({
      tournament
    })
  }
}
