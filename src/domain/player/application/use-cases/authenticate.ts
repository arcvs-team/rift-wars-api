import 'reflect-metadata'
import { left, type Either, right } from '@/core/either'
import { inject, injectable } from 'inversify'
import { PlayerRepository } from '../repositories/player-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'

interface AuthenticateParams {
  email: string
  password: string
}

type AuthenticateResult = Either<InvalidCredentialsError, {
  accessToken: string
}>

@injectable()
export class AuthenticateUseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository,

    @inject('HashComparer')
    private readonly hashComparer: HashComparer,

    @inject('Encrypter')
    private readonly encrypter: Encrypter
  ) {}

  async execute ({ email, password }: AuthenticateParams): Promise<AuthenticateResult> {
    const player = await this.playerRepository.findByEmail(email)

    if (player === null) {
      return left(new InvalidCredentialsError())
    }

    const passwordMatches = await this.hashComparer.compare(password, player.password)

    if (!passwordMatches) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt(player.id.toString())

    return right({
      accessToken
    })
  }
}
