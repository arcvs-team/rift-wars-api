import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { InvalidAccessTokenError } from './errors/invalid-access-token.error'
import { FetchPlayerByIdUseCase } from './fetch-player-by-id'
import { makePlayer } from 'test/factories/make-player'

describe('fetch player by id', () => {
  let inMemoryPlayerRepository: InMemoryPlayerRepository
  let sut: FetchPlayerByIdUseCase

  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    sut = new FetchPlayerByIdUseCase(inMemoryPlayerRepository)
  })

  it('should return an error if the player does not exist', async () => {
    const result = await sut.execute({ userId: 'nonexistent' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should return the player if it exists', async () => {
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)

    const result = await sut.execute({ userId: player.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.player.id.toString()).toEqual(player.id.toString())
    }
  })
})
