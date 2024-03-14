import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { FetchTeamsUseCase } from './fetch-teams'
import { makeTeam } from 'test/factories/make-team'

describe('fetch teams', () => {
  let inMemoryTeamRepository: InMemoryTeamRepository
  let sut: FetchTeamsUseCase

  beforeEach(() => {
    inMemoryTeamRepository = new InMemoryTeamRepository()
    sut = new FetchTeamsUseCase(inMemoryTeamRepository)
  })

  it('should return an empty array if no teams are found', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.teams).toHaveLength(0)
    }
  })

  it('should return a list of teams', async () => {
    const team = makeTeam()
    inMemoryTeamRepository.create(team)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.teams).toHaveLength(1)
      expect(result.value.teams[0].createdBy.toString()).toBe(team.createdBy.toString())
    }
  })
})
