import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { PlayerRepository } from '../repositories/player-repository'
import { type Either, left, right } from '@/core/either'
import { InvalidAccessTokenError } from './errors/invalid-access-token.error'
import { type Player } from '../../enterprise/entities/player'
import { type UseCase } from '@/core/protocols/use-case'

interface FetchPlayerByIdParams {
  userId: string
}

type FetchPlayerByIdResult = Either<InvalidAccessTokenError, {
  player: Player
}>

@injectable()
export class FetchPlayerByIdUseCase implements UseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository
  ) {}

  async execute ({ userId }: FetchPlayerByIdParams): Promise<FetchPlayerByIdResult> {
    const player = await this.playerRepository.findById(userId)

    if (player === null) {
      return left(new InvalidAccessTokenError())
    }

    return right({
      player
    })
  }
}
