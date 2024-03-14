import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { TournamentRepository } from '../repositories/tournament-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Either, right } from '@/core/either'
import { Tournament } from '../../enterprise/entities/tournament'
import { type UseCase } from '@/core/protocols/use-case'

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

type CreateTournamentResult = Either<null, {
  tournament: Tournament
}>

@injectable()
export class CreateTournamentUseCase implements UseCase {
  constructor (
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
    const tournament = Tournament.create({
      name,
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
