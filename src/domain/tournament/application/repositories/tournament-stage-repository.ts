import { type TournamentStage } from '../../enterprise/entities/tournament-stage'

export interface TournamentStageRepository {
  findManyByTournamentId: (tournamentId: string) => Promise<TournamentStage[]>
  create: (tournamentStage: TournamentStage) => Promise<void>
}
