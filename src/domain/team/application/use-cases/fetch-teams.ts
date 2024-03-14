import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { type UseCase } from '@/core/protocols/use-case'
import { TeamRepository } from '../repositories/team-repository'
import { right, type Either } from '@/core/either'
import { type Team } from '../../enterprise/entities/team'

type FetchTeamsResult = Either<null, {
  teams: Team[]
}>

@injectable()
export class FetchTeamsUseCase implements UseCase {
  constructor (
    @inject('TeamRepository')
    private readonly teamRepository: TeamRepository
  ) {}

  async execute (): Promise<FetchTeamsResult> {
    const teams = await this.teamRepository.findMany()

    return right({
      teams
    })
  }
}
