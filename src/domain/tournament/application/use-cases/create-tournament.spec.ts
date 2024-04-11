import { InMemoryTournamentRepository } from 'test/repositories/in-memory-tournament-repository'
import { CreateTournamentUseCase } from './create-tournament'
import { makeTournament } from 'test/factories/make-tournament'
import { InMemoryRiotTournamentProviderRepository } from 'test/repositories/in-memory-riot-tournament-provider-repository'
import { type CreateTournament } from '../riot/create-tournament'
import { FakeRiotApiServices } from 'test/riot/fake-riot-api-services'
import { makeRiotTournamentProvider } from 'test/factories/make-riot-tournament-provider'
import { ActiveRiotTournamentProviderNotFoundError } from './errors/active-riot-tournament-provider-not-found.error'

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

  it('should not be able to create a tournament if there is no active provider', async () => {
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

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ActiveRiotTournamentProviderNotFoundError)
  })

  it('should be able to create a tournament', async () => {
    const tournament = makeTournament()
    const riotTournamentProvider = makeRiotTournamentProvider()
    inMemoryRiotTournamentProviderRepository.items.push(riotTournamentProvider)

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

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.tournament.createdBy.toString()).toBe(tournament.createdBy.toString())
    }
  })
})
