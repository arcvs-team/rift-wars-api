import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { InMemoryTeamPlayerInviteRepository } from 'test/repositories/in-memory-team-player-invite-repository'
import { InvitePlayerToTeamUseCase } from './invite-player-to-team'
import { PlayerNotFoundError } from './errors/player-not-found.error'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { makePlayer } from 'test/factories/make-player'
import { TeamNotFoundError } from './errors/team-not-found.error'
import { makeTeam } from 'test/factories/make-team'
import { makeTeamPlayerInvite } from 'test/factories/make-team-player-invite'
import { PlayerAlreadyInvitedError } from './errors/player-already-invited.error'
import { makeTeamPlayer } from 'test/factories/make-team-player'
import { InMemoryTeamPlayerRepository } from 'test/repositories/in-memory-team-player-repository'
import { PlayerAlreadyOnTeamError } from './errors/player-already-on-team.error'

describe('invite player to team', () => {
  let inMemoryTeamPlayerRepository: InMemoryTeamPlayerRepository
  let inMemoryTeamPlayerInviteRepository: InMemoryTeamPlayerInviteRepository
  let inMemoryPlayerRepository: InMemoryPlayerRepository
  let inMemoryTeamRepository: InMemoryTeamRepository
  let sut: InvitePlayerToTeamUseCase

  beforeEach(() => {
    inMemoryTeamPlayerRepository = new InMemoryTeamPlayerRepository()
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    inMemoryTeamRepository = new InMemoryTeamRepository()
    inMemoryTeamPlayerInviteRepository = new InMemoryTeamPlayerInviteRepository()
    sut = new InvitePlayerToTeamUseCase(
      inMemoryTeamPlayerRepository,
      inMemoryTeamPlayerInviteRepository,
      inMemoryPlayerRepository,
      inMemoryTeamRepository
    )
  })

  it('should not be able to invite a player that is already on the team', async () => {
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)
    const team = makeTeam({ createdBy: player.id })
    inMemoryTeamRepository.create(team)
    const teamPlayer = makeTeamPlayer({ playerId: player.id, teamId: team.id })
    inMemoryTeamPlayerRepository.create(teamPlayer)

    const result = await sut.execute({
      playerId: player.id.toString(),
      teamId: team.id.toString(),
      invitedBy: 'any-player-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerAlreadyOnTeamError)
  })

  it('should not be able to invite a player that already has a pending invitation to the same team', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite()
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamId: teamPlayerInvite.teamId.toString(),
      invitedBy: 'any-player-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerAlreadyInvitedError)
  })

  it('should not be able to invite a player that does not exists', async () => {
    const result = await sut.execute({
      playerId: 'invalid-player-id',
      teamId: 'any-team-id',
      invitedBy: 'any-player-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerNotFoundError)
  })

  it('should not be able to invite a player to a team that does not exists', async () => {
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)

    const result = await sut.execute({
      playerId: player.id.toString(),
      teamId: 'invalid-team-id',
      invitedBy: 'any-player-id'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TeamNotFoundError)
  })

  it('should be able to invite a player to a team', async () => {
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)
    const team = makeTeam({ createdBy: player.id })
    inMemoryTeamRepository.create(team)

    const result = await sut.execute({
      playerId: player.id.toString(),
      teamId: team.id.toString(),
      invitedBy: player.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTeamPlayerInviteRepository.items).toHaveLength(1)
  })
})
