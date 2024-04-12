import 'reflect-metadata'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { right, type Either } from '@/core/either'
import { type TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'
import { TeamPlayerInviteRepository } from '@/domain/team/application/repositories/team-player-invite-repository'

interface FetchPlayerTeamInvitesParams {
  playerId: string
}

type FetchPlayerTeamInvitesResult = Either<null, {
  invites: TeamPlayerInvite[]
}>

@injectable()
export class FetchPlayerTeamInvitesUseCase implements UseCase {
  constructor (
    @inject('TeamPlayerInviteRepository')
    private readonly teamPlayerInviteRepository: TeamPlayerInviteRepository
  ) {}

  async execute ({ playerId }: FetchPlayerTeamInvitesParams): Promise<FetchPlayerTeamInvitesResult> {
    const invites = await this.teamPlayerInviteRepository.findManyByPlayerId(playerId)

    return right({
      invites
    })
  }
}
