import { FetchPlayerOwnedTeamsUseCase } from './fetch-player-owned-teams'
import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { makeTeam } from 'test/factories/make-team'

describe('fetch player owned teams', () => {
  let sut: FetchPlayerOwnedTeamsUseCase
  let inMemoryTeamRepository: InMemoryTeamRepository

  beforeEach(() => {
    inMemoryTeamRepository = new InMemoryTeamRepository()
    sut = new FetchPlayerOwnedTeamsUseCase(inMemoryTeamRepository)
  })

  it('should return an empty array if no teams are found', async () => {
    const result = await sut.execute({ playerId: 'non-existing-id' })

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.teams).toHaveLength(0)
    }
  })

  it('should return a list of teams', async () => {
    const team = makeTeam()
    await inMemoryTeamRepository.create(team)

    const result = await sut.execute({ playerId: team.createdBy.toString() })

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.teams).toHaveLength(1)
      expect(result.value.teams[0].createdBy.toString()).toBe(team.createdBy.toString())
    }
  })
})
