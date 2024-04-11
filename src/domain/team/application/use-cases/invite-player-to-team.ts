import 'reflect-metadata'
import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { PlayerRepository } from '@/domain/player/application/repositories/player-repository'
import { inject, injectable } from 'inversify'
import { PlayerNotFoundError } from './errors/player-not-found.error'
import { TeamPlayerInviteRepository } from '../repositories/team-player-invite-repository'
import { TeamPlayerInvite } from '../../enterprise/entities/team-player-invite'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TeamRepository } from '../repositories/team-repository'
import { TeamNotFoundError } from './errors/team-not-found.error'
import { PlayerAlreadyInvitedError } from './errors/player-already-invited.error'
import { TeamPlayerRepository } from '../repositories/team-player-repository'
import { PlayerAlreadyOnTeamError } from './errors/player-already-on-team.error'

interface InvitePlayerToTeamParams {
  playerId: string
  teamId: string
  invitedBy: string
}

type InvitePlayerToTeamResult = Either<PlayerAlreadyOnTeamError | PlayerAlreadyInvitedError | PlayerNotFoundError | TeamNotFoundError, null>

@injectable()
export class InvitePlayerToTeamUseCase implements UseCase {
  constructor (
    @inject('TeamPlayerRepository')
    private readonly teamPlayerRepository: TeamPlayerRepository,

    @inject('TeamPlayerInviteRepository')
    private readonly teamPlayerInviteRepository: TeamPlayerInviteRepository,

    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository,

    @inject('TeamRepository')
    private readonly teamRepository: TeamRepository
  ) {}

  async execute ({
    playerId,
    teamId,
    invitedBy
  }: InvitePlayerToTeamParams): Promise<InvitePlayerToTeamResult> {
    const playerAlreadyInTeam = await this.teamPlayerRepository.findByPlayerIdAndTeamId(playerId, teamId)

    if (playerAlreadyInTeam) {
      return left(new PlayerAlreadyOnTeamError())
    }

    const playerInvitedToTeam = await this.teamPlayerInviteRepository.findByPlayerIdAndTeamId(playerId, teamId)

    if (playerInvitedToTeam) {
      return left(new PlayerAlreadyInvitedError())
    }

    const player = await this.playerRepository.findById(playerId)

    if (!player) {
      return left(new PlayerNotFoundError())
    }

    const team = await this.teamRepository.findById(teamId)

    if (!team) {
      return left(new TeamNotFoundError())
    }

    const teamPlayerInvite = TeamPlayerInvite.create({
      playerId: new UniqueEntityID(playerId),
      teamId: new UniqueEntityID(teamId),
      invitedBy: new UniqueEntityID(invitedBy)
    })

    await this.teamPlayerInviteRepository.create(teamPlayerInvite)

    return right(null)
  }
}
