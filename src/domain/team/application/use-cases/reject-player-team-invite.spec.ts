import { InMemoryTeamPlayerInviteRepository } from 'test/repositories/in-memory-team-player-invite-repository'
import { InviteNotFoundError } from './errors/invite-not-found.error'
import { makeTeamPlayerInvite } from 'test/factories/make-team-player-invite'
import { InviteNotValidError } from './errors/invite-not-valid.error'
import { RejectPlayerTeamInviteUseCase } from './reject-player-team-invite'

describe('reject player team invite', () => {
  let inMemoryTeamPlayerInviteRepository: InMemoryTeamPlayerInviteRepository
  let sut: RejectPlayerTeamInviteUseCase

  beforeEach(() => {
    inMemoryTeamPlayerInviteRepository = new InMemoryTeamPlayerInviteRepository()
    sut = new RejectPlayerTeamInviteUseCase(inMemoryTeamPlayerInviteRepository)
  })

  it('should not be able to reject if the invite does not exists', async () => {
    const result = await sut.execute({ playerId: '1', teamPlayerInviteId: '1' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotFoundError)
  })

  it('should not be able to reject a invite that has been already accepted', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite({ acceptedAt: new Date() })
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotValidError)
  })

  it('should not be able to reject a invite that has been already rejected', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite({ rejectedAt: new Date() })
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotValidError)
  })

  it('should not be able to reject a invite that is not from the player', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite()
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: 'other-player-id',
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InviteNotValidError)
  })

  it('should be able to reject the invite', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite()
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({
      playerId: teamPlayerInvite.playerId.toString(),
      teamPlayerInviteId: teamPlayerInvite.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTeamPlayerInviteRepository.items[0].rejectedAt).toBeTruthy()
    expect(inMemoryTeamPlayerInviteRepository.items[0].acceptedAt).toBe(undefined)
  })
})
