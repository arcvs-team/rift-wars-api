import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { PlayerRepository } from '../repositories/player-repository'
import { right, type Either } from '@/core/either'
import { type Player } from '@/domain/enterprise/player'

type FetchPlayersResult = Either<null, {
  players: Player[]
}>

@injectable()
export class FetchPlayersUseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository
  ) {}

  async execute (): Promise<FetchPlayersResult> {
    const players = await this.playerRepository.findMany()

    return right({
      players
    })
  }
}
