import { InMemoryTournamentRepository } from 'test/repositories/in-memory-tournament-repository'
import { FetchTournamentsUseCase } from './fetch-tournaments'
import { makeTournament } from 'test/factories/make-tournament'

describe('fetch tournaments', () => {
  let inMemoryTournamentRepository: InMemoryTournamentRepository
  let sut: FetchTournamentsUseCase

  beforeEach(() => {
    inMemoryTournamentRepository = new InMemoryTournamentRepository()
    sut = new FetchTournamentsUseCase(inMemoryTournamentRepository)
  })

  it('should return an empty array if there are no tournaments', async () => {
    const result = await sut.execute()

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tournaments).toHaveLength(0)
    }
  })

  it('should return a list of tournaments', async () => {
    const tournament = makeTournament()
    inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute()

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tournaments).toHaveLength(1)
    }
  })
})
