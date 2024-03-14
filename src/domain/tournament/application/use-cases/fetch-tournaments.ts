import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { TournamentRepository } from '../repositories/tournament-repository'
import { type Either, right } from '@/core/either'
import { type Tournament } from '../../enterprise/entities/tournament'
import { type UseCase } from '@/core/protocols/use-case'

type FetchTournamentsResult = Either<null, {
  tournaments: Tournament[]
}>

@injectable()
export class FetchTournamentsUseCase implements UseCase {
  constructor (
    @inject('TournamentRepository')
    private readonly tournamentRepository: TournamentRepository
  ) {}

  async execute (): Promise<FetchTournamentsResult> {
    const tournaments = await this.tournamentRepository.findMany()

    return right({
      tournaments
    })
  }
}
