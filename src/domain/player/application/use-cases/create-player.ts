import 'reflect-metadata'
import { right, type Either, left } from '@/core/either'
import { type PlayerRepository } from '../repositories/player-repository'
import { inject, injectable } from 'inversify'
import { PlayerAlreadyExistsError } from './errors/player-already-exists.error'
import { HashGenerator } from '../cryptography/hash-generator'
import { Player } from '../../enterprise/entities/player'
import { type UseCase } from '@/core/protocols/use-case'
import { randomUUID } from 'crypto'

interface CreatePlayerParams {
  email: string
  riotId: string
  password: string
}

type CreatePlayerResult = Either<PlayerAlreadyExistsError, {
  player: Player
}>

@injectable()
export class CreatePlayerUseCase implements UseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository,

    @inject('HashGenerator')
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute ({ email, riotId, password }: CreatePlayerParams): Promise<CreatePlayerResult> {
    const playerAlreadyExists = await this.playerRepository.findByEmailOrRiotId(email, riotId)

    if (playerAlreadyExists !== null) {
      return left(new PlayerAlreadyExistsError(riotId))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const player = Player.create({
      email,
      riotPuuid: randomUUID(),
      riotId,
      password: hashedPassword
    })

    await this.playerRepository.create(player)

    return right({
      player
    })
  }
}
