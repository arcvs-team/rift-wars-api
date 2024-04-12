import 'reflect-metadata'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { right, type Either } from '@/core/either'
import { type TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'
import { TeamPlayerInviteRepository } from '@/domain/team/application/repositories/team-player-invite-repository'

interface FetchPlayerOpenTeamInvitesParams {
  playerId: string
}

type FetchPlayerOpenTeamInvitesResult = Either<null, {
  invites: TeamPlayerInvite[]
}>

@injectable()
export class FetchPlayerOpenTeamInvitesUseCase implements UseCase {
  constructor (
    @inject('TeamPlayerInviteRepository')
    private readonly teamPlayerInviteRepository: TeamPlayerInviteRepository
  ) {}

  async execute ({ playerId }: FetchPlayerOpenTeamInvitesParams): Promise<FetchPlayerOpenTeamInvitesResult> {
    const invites = await this.teamPlayerInviteRepository.findManyOpenByPlayerId(playerId)

    return right({
      invites
    })
  }
}
