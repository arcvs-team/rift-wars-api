import { InMemoryTournamentRepository } from 'test/repositories/in-memory-tournament-repository'
import { CreateTournamentUseCase } from './create-tournament'
import { makeTournament } from 'test/factories/make-tournament'
import { InMemoryRiotTournamentProviderRepository } from 'test/repositories/in-memory-riot-tournament-provider-repository'
import { type CreateTournament } from '../riot/create-tournament'
import { FakeRiotApiServices } from 'test/riot/fake-riot-api-services'

describe('create tournament', () => {
  let inMemoryRiotTournamentProviderRepository: InMemoryRiotTournamentProviderRepository
  let fakeCreateTournamentService: CreateTournament
  let inMemoryTournamentRepository: InMemoryTournamentRepository
  let sut: CreateTournamentUseCase

  beforeEach(() => {
    inMemoryRiotTournamentProviderRepository = new InMemoryRiotTournamentProviderRepository()
    fakeCreateTournamentService = new FakeRiotApiServices()
    inMemoryTournamentRepository = new InMemoryTournamentRepository()
    sut = new CreateTournamentUseCase(
      inMemoryRiotTournamentProviderRepository,
      fakeCreateTournamentService,
      inMemoryTournamentRepository
    )
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
