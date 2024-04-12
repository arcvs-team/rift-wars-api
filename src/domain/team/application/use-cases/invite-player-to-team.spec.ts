import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { InMemoryTeamPlayerInviteRepository } from 'test/repositories/in-memory-team-player-invite-repository'
import { InvitePlayerToTeamUseCase } from './invite-player-to-team'
import { PlayerNotFoundError } from './errors/player-not-found.error'
import { makePlayer } from 'test/factories/make-player'
import { makeTeamPlayerInvite } from 'test/factories/make-team-player-invite'
import { PlayerAlreadyInvitedError } from './errors/player-already-invited.error'
import { makeTeamPlayer } from 'test/factories/make-team-player'
import { InMemoryTeamPlayerRepository } from 'test/repositories/in-memory-team-player-repository'
import { PlayerAlreadyOnTeamError } from './errors/player-already-on-team.error'
import { InvitesRestrictedToCaptainsError } from './errors/invites-restricted-to-captains.error'

describe('invite player to team', () => {
  let inMemoryTeamPlayerRepository: InMemoryTeamPlayerRepository
  let inMemoryTeamPlayerInviteRepository: InMemoryTeamPlayerInviteRepository
  let inMemoryPlayerRepository: InMemoryPlayerRepository
  let sut: InvitePlayerToTeamUseCase

  beforeEach(() => {
    inMemoryTeamPlayerRepository = new InMemoryTeamPlayerRepository()
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    inMemoryTeamPlayerInviteRepository = new InMemoryTeamPlayerInviteRepository()
    sut = new InvitePlayerToTeamUseCase(
      inMemoryTeamPlayerRepository,
      inMemoryTeamPlayerInviteRepository,
      inMemoryPlayerRepository
    )
  })

  it('should not be able to invite a player if you are not the captain of the team', async () => {
    const captain = makePlayer()
    inMemoryPlayerRepository.create(captain)
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)
    const captainTeamPlayer = makeTeamPlayer({ playerId: captain.id, isCaptain: true })
    inMemoryTeamPlayerRepository.create(captainTeamPlayer)

    const result = await sut.execute({
      playerId: player.id.toString(),
      teamId: captainTeamPlayer.teamId.toString(),
      invitedBy: player.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvitesRestrictedToCaptainsError)
  })

  it('should not be able to invite a player that is already on the team', async () => {
    const captain = makePlayer()
    inMemoryPlayerRepository.create(captain)
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)
    const captainTeamPlayer = makeTeamPlayer({ playerId: captain.id, isCaptain: true })
    inMemoryTeamPlayerRepository.create(captainTeamPlayer)
    const teamPlayer = makeTeamPlayer({ playerId: player.id, teamId: captainTeamPlayer.teamId })
    inMemoryTeamPlayerRepository.create(teamPlayer)

    const result = await sut.execute({
      playerId: player.id.toString(),
      teamId: captainTeamPlayer.teamId.toString(),
      invitedBy: captain.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerAlreadyOnTeamError)
  })

  it('should not be able to invite a player that already has a pending invitation to the same team', async () => {
    const captain = makePlayer()
    inMemoryPlayerRepository.create(captain)
    const captainTeamPlayer = makeTeamPlayer({ playerId: captain.id, isCaptain: true })
    inMemoryTeamPlayerRepository.create(captainTeamPlayer)
    const teamPlayerInvite = makeTeamPlayerInvite({ teamId: captainTeamPlayer.teamId, invitedBy: captain.id })
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamId: teamPlayerInvite.teamId.toString(),
      invitedBy: captain.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerAlreadyInvitedError)
  })

  it('should not be able to invite a player that does not exists', async () => {
    const captain = makePlayer()
    inMemoryPlayerRepository.create(captain)
    const captainTeamPlayer = makeTeamPlayer({ playerId: captain.id, isCaptain: true })
    inMemoryTeamPlayerRepository.create(captainTeamPlayer)

    const result = await sut.execute({
      playerId: 'invalid-player-id',
      teamId: captainTeamPlayer.teamId.toString(),
      invitedBy: captain.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerNotFoundError)
  })

  it('should be able to invite a player to a team', async () => {
    const captain = makePlayer()
    inMemoryPlayerRepository.create(captain)
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)
    const captainTeamPlayer = makeTeamPlayer({ playerId: captain.id, isCaptain: true })
    inMemoryTeamPlayerRepository.create(captainTeamPlayer)

    const result = await sut.execute({
      playerId: player.id.toString(),
      teamId: captainTeamPlayer.teamId.toString(),
      invitedBy: captain.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTeamPlayerInviteRepository.items).toHaveLength(1)
  })
})
