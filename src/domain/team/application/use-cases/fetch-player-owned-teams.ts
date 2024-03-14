import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { TeamRepository } from '../repositories/team-repository'
import { type Either, right } from '@/core/either'
import { type Team } from '../../enterprise/entities/team'

interface FetchPlayerOwnedTeamsParams {
  playerId: string
}

type FetchPlayerOwnedTeamsResult = Either<null, {
  teams: Team[]
}>

@injectable()
export class FetchPlayerOwnedTeamsUseCase {
  constructor (
    @inject('TeamRepository')
    private readonly teamRepository: TeamRepository
  ) {}

  async execute ({ playerId }: FetchPlayerOwnedTeamsParams): Promise<FetchPlayerOwnedTeamsResult> {
    const teams = await this.teamRepository.findManyByCreatedBy(playerId)

    return right({
      teams
    })
  }
}
