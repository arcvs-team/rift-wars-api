import { InMemoryRiotGameResultRepository } from 'test/repositories/in-memory-riot-game-result-repository'
import { HandleFinishedGameUseCase } from './handle-finished-game'
import { FakeRiotApiServices } from 'test/riot/fake-riot-api-services'
import { makeFinishedMatchData } from 'test/factories/riot/make-finished-match-data'

describe('handle finished game', () => {
  let inMemoryRiotGameResultRepository: InMemoryRiotGameResultRepository
  let fakeRiotApiServices: FakeRiotApiServices
  let sut: HandleFinishedGameUseCase

  beforeEach(() => {
    inMemoryRiotGameResultRepository = new InMemoryRiotGameResultRepository()
    fakeRiotApiServices = new FakeRiotApiServices()
    sut = new HandleFinishedGameUseCase(inMemoryRiotGameResultRepository, fakeRiotApiServices)
  })

  it('should store the postback from riot games', async () => {
    const finishedMatchData = makeFinishedMatchData()

    await sut.execute(finishedMatchData)

    expect(inMemoryRiotGameResultRepository.items).toHaveLength(1)
  })

  it('should call the riot api to fetch the match data', async () => {
    const fetchMatchSpy = vi.spyOn(fakeRiotApiServices, 'fetchMatch')
    const finishedMatchData = makeFinishedMatchData()

    await sut.execute(finishedMatchData)

    expect(fetchMatchSpy).toHaveBeenCalledTimes(1)
  })
})
