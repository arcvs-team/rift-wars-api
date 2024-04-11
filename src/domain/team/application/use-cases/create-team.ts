import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { TeamRepository } from '../repositories/team-repository'
import { right, type Either } from '@/core/either'
import { Team } from '../../enterprise/entities/team'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type UseCase } from '@/core/protocols/use-case'
import { TeamPlayerRepository } from '../repositories/team-player-repository'
import { TeamPlayer } from '../../enterprise/entities/team-player'

interface CreateTeamParams {
  name: string
  createdBy: string
}

type CreateTeamResult = Either<null, {
  team: Team
}>

@injectable()
export class CreateTeamUseCase implements UseCase {
  constructor (
    @inject('TeamRepository')
    private readonly teamRepository: TeamRepository,

    @inject('TeamPlayerRepository')
    private readonly teamPlayerRepository: TeamPlayerRepository
  ) {}

  async execute ({ name, createdBy }: CreateTeamParams): Promise<CreateTeamResult> {
    const team = Team.create({
      name,
      createdBy: new UniqueEntityID(createdBy)
    })

    await this.teamRepository.create(team)

    const teamPlayer = TeamPlayer.create({
      playerId: new UniqueEntityID(createdBy),
      teamId: team.id,
      isCaptain: true
    })

    await this.teamPlayerRepository.create(teamPlayer)

    return right({
      team
    })
  }
}
