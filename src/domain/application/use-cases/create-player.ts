import { Player } from '../../enterprise/player'
import { type PlayerRepository } from '../repositories/player-repository'
import { inject, injectable } from 'inversify'

interface CreatePlayerParams {
  email: string
  riotId: string
}

@injectable()
export class CreatePlayerUseCase {
  constructor (
    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository
  ) {}

  async execute ({ email, riotId }: CreatePlayerParams): Promise<Player> {
    const player = Player.create({
      email,
      riotId
    })

    const createdPlayer = await this.playerRepository.create(player)

    return createdPlayer
  }
}
