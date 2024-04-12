import { Mutation, Resolver } from 'type-graphql'
import { TeamPlayerInviteModel } from '../dtos/models/team-player-invite.model'
import { type InvitePlayerToTeamUseCase } from '@/domain/team/application/use-cases/invite-player-to-team'
import { container } from '@/infra/container/inversify'

@Resolver(TeamPlayerInviteModel)
export class TeamPlayerInviteResolver {
  private readonly invitePlayerToTeamUseCase: InvitePlayerToTeamUseCase

  constructor () {
    this.invitePlayerToTeamUseCase = container.get('InvitePlayerToTeamUseCase')
  }

  @Mutation(() => TeamPlayerInviteModel)
  async createInvite () {}
}
