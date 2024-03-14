import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { AuthenticateUseCase } from './authenticate'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { makePlayer } from 'test/factories/make-player'

describe('authenticate', () => {
  let inMemoryPlayerRepository: InMemoryPlayerRepository
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateUseCase

  beforeEach(() => {
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(inMemoryPlayerRepository, fakeHasher, fakeEncrypter)
  })

  it('should throw an error if the player is not found', async () => {
    const result = await sut.execute({
      email: 'invalid-email',
      password: 'invalid-password'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw an error if the player password does not match', async () => {
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)

    const result = await sut.execute({
      email: player.email,
      password: `invalid-${player.password}`
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return a token if the player is found and the password matches', async () => {
    const player = makePlayer({
      password: 'valid-password-hashed'
    })
    inMemoryPlayerRepository.create(player)

    const result = await sut.execute({
      email: player.email,
      password: 'valid-password'
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.accessToken).toBeTruthy()
    }
  })
})
