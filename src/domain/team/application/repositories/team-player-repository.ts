import { type TeamPlayer } from '../../enterprise/entities/team-player'

export interface TeamPlayerRepository {
  create: (teamPlayer: TeamPlayer) => Promise<void>
}
