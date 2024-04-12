import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { TeamPlayerInviteModel } from '../dtos/models/team-player-invite.model'
import { type InvitePlayerToTeamUseCase } from '@/domain/team/application/use-cases/invite-player-to-team'
import { container } from '@/infra/container/inversify'
import { CreateTeamPlayerInviteInput } from '../dtos/inputs/create-team-player-invite'
import { Player } from '@/domain/player/enterprise/entities/player'
import { GraphQLError } from 'graphql'
import { ApolloTeamPlayerInviteMapper } from '../mappers/apollo-team-player-invite-mapper'

@Resolver(TeamPlayerInviteModel)
export class TeamPlayerInviteResolver {
  private readonly invitePlayerToTeamUseCase: InvitePlayerToTeamUseCase

  constructor () {
    this.invitePlayerToTeamUseCase = container.get('InvitePlayerToTeamUseCase')
  }

  @Mutation(() => TeamPlayerInviteModel)
  async createInvite (@Arg('data') createTeamPlayerInviteInput: CreateTeamPlayerInviteInput, @Ctx() context: { player?: Player }) {
    if (!(context.player instanceof Player)) throw new GraphQLError('Unauthorized')

    const result = await this.invitePlayerToTeamUseCase.execute({
      playerId: createTeamPlayerInviteInput.playerId,
      teamId: createTeamPlayerInviteInput.teamId,
      invitedBy: context.player.id.toString()
    })

    if (result.isRight()) {
      return ApolloTeamPlayerInviteMapper.toApollo(result.value.invite)
    }

    throw new GraphQLError(result.value.message ?? 'Internal server error.')
  }
}
