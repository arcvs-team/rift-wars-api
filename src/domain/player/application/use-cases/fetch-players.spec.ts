import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { FetchPlayersUseCase } from './fetch-players'
import { makePlayer } from 'test/factories/make-player'

describe('fetch players', () => {
  let sut: FetchPlayersUseCase
  let inMemoryPlayerRepository: InMemoryPlayerRepository

  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    sut = new FetchPlayersUseCase(inMemoryPlayerRepository)
  })

  it('should return an empty array if no players are found', async () => {
    const result = await sut.execute()

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.players).toHaveLength(0)
    }
  })

  it('should return a list of players', async () => {
    const player = makePlayer()
    await inMemoryPlayerRepository.create(player)

    const result = await sut.execute()

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.players).toHaveLength(1)
      expect(result.value.players[0].id).toBe(player.id)
    }
  })
})
