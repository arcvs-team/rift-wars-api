import { InMemoryTeamPlayerInviteRepository } from 'test/repositories/in-memory-team-player-invite-repository'
import { makeTeamPlayerInvite } from 'test/factories/make-team-player-invite'
import { FetchPlayerOpenTeamInvitesUseCase } from '@/domain/team/application/use-cases/fetch-player-team-invites'

describe('fetch player team invites', () => {
  let inMemoryTeamPlayerInviteRepository: InMemoryTeamPlayerInviteRepository
  let sut: FetchPlayerOpenTeamInvitesUseCase

  beforeEach(() => {
    inMemoryTeamPlayerInviteRepository = new InMemoryTeamPlayerInviteRepository()
    sut = new FetchPlayerOpenTeamInvitesUseCase(inMemoryTeamPlayerInviteRepository)
  })

  it('should return an empty array if no team player invites are found', async () => {
    const result = await sut.execute({ playerId: 'any-player-id' })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.invites).toHaveLength(0)
    }
  })

  it('should return a list of team player invites', async () => {
    const teamPlayerInvite = makeTeamPlayerInvite()
    inMemoryTeamPlayerInviteRepository.create(teamPlayerInvite)

    const result = await sut.execute({ playerId: teamPlayerInvite.playerId.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.invites).toHaveLength(1)
      expect(result.value.invites[0].playerId.toString()).toBe(teamPlayerInvite.playerId.toString())
    }
  })
})
