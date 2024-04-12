import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { TeamPlayerInviteModel } from '../dtos/models/team-player-invite.model'
import { type InvitePlayerToTeamUseCase } from '@/domain/team/application/use-cases/invite-player-to-team'
import { container } from '@/infra/container/inversify'
import { CreateTeamPlayerInviteInput } from '../dtos/inputs/create-team-player-invite'
import { Player } from '@/domain/player/enterprise/entities/player'
import { GraphQLError } from 'graphql'
import { ApolloTeamPlayerInviteMapper } from '../mappers/apollo-team-player-invite-mapper'
import { type FetchPlayerOpenTeamInvitesUseCase } from '@/domain/team/application/use-cases/fetch-player-team-invites'
import { AcceptTeamPlayerInviteInput } from '../dtos/inputs/accept-team-player-invite'
import { type AcceptPlayerTeamInviteUseCase } from '@/domain/team/application/use-cases/accept-player-team-invite'
import { type RejectPlayerTeamInviteUseCase } from '@/domain/team/application/use-cases/reject-player-team-invite'
import { RejectTeamPlayerInviteInput } from '../dtos/inputs/reject-team-player-invite'

@Resolver(TeamPlayerInviteModel)
export class TeamPlayerInviteResolver {
  private readonly fetchPlayerOpenTeamInvitesUseCase: FetchPlayerOpenTeamInvitesUseCase
  private readonly invitePlayerToTeamUseCase: InvitePlayerToTeamUseCase
  private readonly acceptPlayerTeamInviteUseCase: AcceptPlayerTeamInviteUseCase
  private readonly rejectPlayerTeamInviteUseCase: RejectPlayerTeamInviteUseCase

  constructor () {
    this.fetchPlayerOpenTeamInvitesUseCase = container.get('FetchPlayerOpenTeamInvitesUseCase')
    this.invitePlayerToTeamUseCase = container.get('InvitePlayerToTeamUseCase')
    this.acceptPlayerTeamInviteUseCase = container.get('AcceptPlayerTeamInviteUseCase')
    this.rejectPlayerTeamInviteUseCase = container.get('RejectPlayerTeamInviteUseCase')
  }

  @Query(() => [TeamPlayerInviteModel])
  async teamInvites (@Ctx() context: { player?: Player }) {
    if (!(context.player instanceof Player)) throw new GraphQLError('Unauthorized')

    const result = await this.fetchPlayerOpenTeamInvitesUseCase.execute({ playerId: context.player.id.toString() })

    if (result.isRight()) {
      return result.value.invites.map(ApolloTeamPlayerInviteMapper.toApollo)
    }

    throw new GraphQLError('Internal server error.')
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

  @Mutation(() => TeamPlayerInviteModel)
  async acceptInvite (@Arg('data') acceptTeamPlayerInviteInput: AcceptTeamPlayerInviteInput, @Ctx() context: { player?: Player }) {
    if (!(context.player instanceof Player)) throw new GraphQLError('Unauthorized')

    const result = await this.acceptPlayerTeamInviteUseCase.execute({
      playerId: context.player.id.toString(),
      teamPlayerInviteId: acceptTeamPlayerInviteInput.teamPlayerInviteId
    })

    if (result.isRight()) {
      return ApolloTeamPlayerInviteMapper.toApollo(result.value.invite)
    }

    throw new GraphQLError(result.value.message ?? 'Internal server error.')
  }

  @Mutation(() => TeamPlayerInviteModel)
  async rejectInvite (@Arg('data') rejectTeamPlayerInviteInput: RejectTeamPlayerInviteInput, @Ctx() context: { player?: Player }) {
    if (!(context.player instanceof Player)) throw new GraphQLError('Unauthorized')

    const result = await this.rejectPlayerTeamInviteUseCase.execute({
      playerId: context.player.id.toString(),
      teamPlayerInviteId: rejectTeamPlayerInviteInput.teamPlayerInviteId
    })

    if (result.isRight()) {
      return ApolloTeamPlayerInviteMapper.toApollo(result.value.invite)
    }

    throw new GraphQLError(result.value.message ?? 'Internal server error.')
  }
}
