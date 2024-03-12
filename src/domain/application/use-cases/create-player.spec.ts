import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { CreatePlayerUseCase } from './create-player'
import { makePlayer } from 'test/factories/make-player'
import { PlayerAlreadyExistsError } from './errors/player-already-exists.error'
import { FakeHasher } from 'test/cryptography/fake-hasher'

describe('create player', () => {
  let sut: CreatePlayerUseCase
  let inMemoryPlayerRepository: InMemoryPlayerRepository
  let fakeHasher: FakeHasher

  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    fakeHasher = new FakeHasher()
    sut = new CreatePlayerUseCase(inMemoryPlayerRepository, fakeHasher)
  })

  it('should not be able to create a player with same email or riot ID', async () => {
    const player = makePlayer()

    await inMemoryPlayerRepository.create(player)

    const result = await sut.execute({
      email: player.email,
      riotId: player.riotId,
      password: player.password
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PlayerAlreadyExistsError)
  })

  it('should be able to create a player', async () => {
    const player = makePlayer()

    const result = await sut.execute({
      riotId: player.riotId,
      email: player.email,
      password: player.password
    })

    expect(result.isRight()).toBe(true)
  })
})
