import { InMemoryTournamentRepository } from 'test/repositories/in-memory-tournament-repository'
import { CreateTournamentUseCase } from './create-tournament'
import { makeTournament } from 'test/factories/make-tournament'

describe('create tournament', () => {
  let inMemoryTournamentRepository: InMemoryTournamentRepository
  let sut: CreateTournamentUseCase

  beforeEach(() => {
    inMemoryTournamentRepository = new InMemoryTournamentRepository()
    sut = new CreateTournamentUseCase(inMemoryTournamentRepository)
  })

  it('should be able to create a tournament', async () => {
    const tournament = makeTournament()

    const result = await sut.execute({
      name: tournament.name,
      description: tournament.description,
      rules: tournament.rules,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      minTeams: tournament.minTeams,
      maxTeams: tournament.maxTeams,
      createdBy: tournament.createdBy.toString()
    })

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tournament.createdBy.toString()).toBe(tournament.createdBy.toString())
    }
  })
})
