import 'reflect-metadata'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { TeamPlayerInviteRepository } from '../repositories/team-player-invite-repository'
import { left, right, type Either } from '@/core/either'
import { type TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'
import { InviteNotFoundError } from './errors/invite-not-found.error'
import { InviteNotValidError } from './errors/invite-not-valid.error'
import { TeamPlayerRepository } from '../repositories/team-player-repository'
import { TeamPlayer } from '../../enterprise/entities/team-player'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AcceptPlayerTeamInviteParams {
  playerId: string
  teamPlayerInviteId: string
}

type AcceptPlayerTeamInviteResult = Either<InviteNotFoundError, {
  invite: TeamPlayerInvite
}>

@injectable()
export class AcceptPlayerTeamInviteUseCase implements UseCase {
  constructor (
    @inject('TeamPlayerInviteRepository')
    private readonly teamPlayerInviteRepository: TeamPlayerInviteRepository,

    @inject('TeamPlayerRepository')
    private readonly teamPlayerRepository: TeamPlayerRepository
  ) {}

  async execute ({ playerId, teamPlayerInviteId }: AcceptPlayerTeamInviteParams): Promise<AcceptPlayerTeamInviteResult> {
    const teamPlayerInvite = await this.teamPlayerInviteRepository.findById(teamPlayerInviteId)

    if (!teamPlayerInvite) {
      return left(new InviteNotFoundError())
    }

    if (teamPlayerInvite.acceptedAt || teamPlayerInvite.rejectedAt || teamPlayerInvite.playerId.toString() !== playerId) {
      return left(new InviteNotValidError())
    }

    teamPlayerInvite.acceptInvite()

    await this.teamPlayerInviteRepository.save(teamPlayerInvite)

    const teamPlayer = TeamPlayer.create({
      playerId: new UniqueEntityID(playerId),
      teamId: teamPlayerInvite.teamId,
      isCaptain: false
    })

    await this.teamPlayerRepository.create(teamPlayer)

    return right({
      invite: teamPlayerInvite
    })
  }
}
