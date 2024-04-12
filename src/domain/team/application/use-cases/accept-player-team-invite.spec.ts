import { InMemoryTeamPlayerInviteRepository } from 'test/repositories/in-memory-team-player-invite-repository'
import { InMemoryTeamPlayerRepository } from 'test/repositories/in-memory-team-player-repository'
import { AcceptPlayerTeamInviteUseCase } from './accept-player-team-invite'
import { InviteNotFoundError } from './errors/invite-not-found.error'
import { makeTeamPlayerInvite } from 'test/factories/make-team-player-invite'
import { InviteNotValidError } from './errors/invite-not-valid.error'

describe('accept player team invite', () => {
  let inMemoryTeamPlayerInviteRepository: InMemoryTeamPlayerInviteRepository
  let inMemoryTeamPlayerRepository: InMemoryTeamPlayerRepository
  let sut: AcceptPlayerTeamInviteUseCase

  beforeEach(() => {
    inMemoryTeamPlayerInviteRepository = new InMemoryTeamPlayerInviteRepository()
    inMemoryTeamPlayerRepository = new InMemoryTeamPlayerRepository()
    sut = new AcceptPlayerTeamInviteUseCase(inMemoryTeamPlayerInviteRepository, inMemoryTeamPlayerRepository)
  })

  it('should not be able to accept if the invite does not exists', async () => {
    const result = await sut.execute({ playerId: '1', teamPlayerInviteId: '1' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotFoundError)
  })

  it('should not be able to accept a invite that has been already accepted', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite({ acceptedAt: new Date() })
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotValidError)
  })

  it('should not be able to accept a invite that has been already rejected', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite({ rejectedAt: new Date() })
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotValidError)
  })

  it('should not be able to accept a invite that is not from the player', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite()
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: 'other-player-id',
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotValidError)
  })

  it('should be able to accept the invite', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite()
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTeamPlayerInviteRepository.items[0].acceptedAt).toBeTruthy()
    expect(inMemoryTeamPlayerRepository.items).toHaveLength(1)
  })
})
