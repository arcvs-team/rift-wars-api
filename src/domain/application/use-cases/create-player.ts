import 'reflect-metadata'
import { right, type Either, left } from '@/core/either'
import { Player } from '../../enterprise/player'
import { type PlayerRepository } from '../repositories/player-repository'
import { inject, injectable } from 'inversify'
import { PlayerAlreadyExistsError } from './errors/player-already-exists.error'

interface CreatePlayerParams {
  email: string
  riotId: string
}

type CreatePlayerResult = Either<PlayerAlreadyExistsError, {
  player: Player
}>

@injectable()
export class CreatePlayerUseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository
  ) {}

  async execute ({ email, riotId }: CreatePlayerParams): Promise<CreatePlayerResult> {
    const playerAlreadyExists = await this.playerRepository.findByEmailOrRiotId(email, riotId)

    if (playerAlreadyExists !== null) {
      return left(new PlayerAlreadyExistsError(riotId))
    }

    const player = Player.create({
      email,
      riotId
    })

    await this.playerRepository.create(player)

    return right({
      player
    })
  }
}
