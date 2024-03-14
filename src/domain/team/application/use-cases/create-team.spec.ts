import { InMemoryTeamRepository } from 'test/repositories/in-memory-team-repository'
import { CreateTeamUseCase } from './create-team'
import { makeTeam } from 'test/factories/make-team'

describe('create team', () => {
  let inMemoryTeamRepository: InMemoryTeamRepository
  let sut: CreateTeamUseCase

  beforeEach(() => {
    inMemoryTeamRepository = new InMemoryTeamRepository()
    sut = new CreateTeamUseCase(inMemoryTeamRepository)
  })

  it('should be able to create a team', async () => {
    const team = makeTeam()

    const result = await sut.execute({
      name: team.name,
      createdBy: team.createdBy.toString()
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.team.name).toEqual(team.name)
    }
  })
})
