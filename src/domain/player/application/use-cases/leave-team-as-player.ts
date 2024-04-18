import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { PlayerDontBelongToTeamError } from './errors/player-dont-belong-to-team.error'
import { inject, injectable } from 'inversify'
import { PlayerRepository } from '../repositories/player-repository'
import { TeamPlayerRepository } from '@/domain/team/application/repositories/team-player-repository'

interface LeaveTeamAsPlayerParams {
  playerId: string
  teamId: string
}

type LeaveTeamAsPlayerResult = Either<PlayerDontBelongToTeamError, null>

@injectable()
export class LeaveTeamAsPlayerUseCase implements UseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository,

    @inject('TeamPlayerRepository')
    private readonly teamPlayerRepository: TeamPlayerRepository
  ) {}

  async execute ({ playerId, teamId }: LeaveTeamAsPlayerParams): Promise<LeaveTeamAsPlayerResult> {
    const teamPlayer = await this.teamPlayerRepository.findByPlayerIdAndTeamId(playerId, teamId)

    if (!teamPlayer) {
      return left(new PlayerDontBelongToTeamError())
    }

    teamPlayer.leaveTeam()

    await this.teamPlayerRepository.save(teamPlayer)

    return right(null)
  }
}
