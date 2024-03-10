import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { CreatePlayerUseCase } from './create-player'
import { makePlayer } from 'test/factories/make-player'
import { PlayerAlreadyExistsError } from './errors/player-already-exists.error'

describe('create player', () => {
  let sut: CreatePlayerUseCase
  let inMemoryPlayerRepository: InMemoryPlayerRepository

  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    sut = new CreatePlayerUseCase(inMemoryPlayerRepository)
  })

  it('should not be able to create a player with same email or riot ID', async () => {
    const player = makePlayer()

    await inMemoryPlayerRepository.create(player)

    const result = await sut.execute({
      email: player.email,
      riotId: player.riotId
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerAlreadyExistsError)
  })

  it('should be able to create a player', async () => {
    const player = makePlayer()

    const result = await sut.execute({
      riotId: player.riotId,
      email: player.email
    })

    expect(result.isRight()).toBe(true)
  })
})
