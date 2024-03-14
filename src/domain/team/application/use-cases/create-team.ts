import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { TeamRepository } from '../repositories/team-repository'
import { right, type Either } from '@/core/either'
import { Team } from '../../enterprise/entities/team'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateTeamParams {
  name: string
  createdBy: string
}

type CreateTeamResult = Either<null, {
  team: Team
}>

@injectable()
export class CreateTeamUseCase {
  constructor (
    @inject('TeamRepository')
    private readonly teamRepository: TeamRepository
  ) {}

  async execute ({ name, createdBy }: CreateTeamParams): Promise<CreateTeamResult> {
    const team = Team.create({
      name,
      createdBy: new UniqueEntityID(createdBy)
    })

    await this.teamRepository.create(team)

    return right({
      team
    })
  }
}
