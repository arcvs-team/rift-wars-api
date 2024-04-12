import 'reflect-metadata'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { TeamPlayerInviteRepository } from '../repositories/team-player-invite-repository'
import { left, right, type Either } from '@/core/either'
import { type TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'
import { InviteNotFoundError } from './errors/invite-not-found.error'
import { InviteNotValidError } from './errors/invite-not-valid.error'

interface RejectPlayerTeamInviteParams {
  playerId: string
  teamPlayerInviteId: string
}

type RejectPlayerTeamInviteResult = Either<InviteNotFoundError, {
  invite: TeamPlayerInvite
}>

@injectable()
export class RejectPlayerTeamInviteUseCase implements UseCase {
  constructor (
    @inject('TeamPlayerInviteRepository')
    private readonly teamPlayerInviteRepository: TeamPlayerInviteRepository
  ) {}

  async execute ({ playerId, teamPlayerInviteId }: RejectPlayerTeamInviteParams): Promise<RejectPlayerTeamInviteResult> {
    const teamPlayerInvite = await this.teamPlayerInviteRepository.findById(teamPlayerInviteId)

    if (!teamPlayerInvite) {
      return left(new InviteNotFoundError())
    }

    if (teamPlayerInvite.acceptedAt || teamPlayerInvite.rejectedAt || teamPlayerInvite.playerId.toString() !== playerId) {
      return left(new InviteNotValidError())
    }

    teamPlayerInvite.rejectInvite()

    await this.teamPlayerInviteRepository.save(teamPlayerInvite)

    return right({
      invite: teamPlayerInvite
    })
  }
}
