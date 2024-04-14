import { left, right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { TournamentRepository } from '@/domain/tournament/application/repositories/tournament-repository'
import { inject, injectable } from 'inversify'
import { TournamentNotFoundError } from './errors/tournament-not-found.error'
import { TournamentNotStartedError } from './errors/tournament-not-started.error'
import { TournamentAlreadyEndedError } from './errors/tournament-already-ended.error'
import { TournamentIsCanceledError } from './errors/tournament-is-canceled'
import { TournamentStageRepository } from '@/domain/tournament/application/repositories/tournament-stage-repository'
import { TournamentStage } from '@/domain/tournament/enterprise/entities/tournament-stage'
import { MatchRepository } from '../repositories/match-repository'
import { TournamentStageHasUnfinishedMatchesError } from '@/domain/match/application/use-cases/errors/tournament-has-unfinished-matches.error'

interface GenerateMatchesParams {
  tournamentId: string
}

type GenerateMatchesResult = Either<TournamentNotFoundError | TournamentIsCanceledError | TournamentNotStartedError | TournamentAlreadyEndedError | TournamentStageHasUnfinishedMatchesError, null>

@injectable()
export class GenerateMatchesUseCase implements UseCase {
  constructor (
    @inject('TournamentRepository')
    private readonly tournamentRepository: TournamentRepository,

    @inject('TournamentStageRepository')
    private readonly tournamentStageRepository: TournamentStageRepository,

    @inject('MatchRepository')
    private readonly matchRepository: MatchRepository
  ) {}

  async execute ({ tournamentId }: GenerateMatchesParams): Promise<GenerateMatchesResult> {
    const tournament = await this.tournamentRepository.findById(tournamentId)

    if (!tournament) {
      return left(new TournamentNotFoundError())
    }

    if (tournament.isCanceled()) {
      return left(new TournamentIsCanceledError())
    }

    if (!tournament.hasStarted()) {
      return left(new TournamentNotStartedError())
    }

    if (tournament.hasEnded()) {
      return left(new TournamentAlreadyEndedError())
    }

    const tournamentStages = await this.tournamentStageRepository.findManyByTournamentId(tournamentId)

    if (tournamentStages.length === tournament.stages) {
      return left(new TournamentAlreadyEndedError())
    }

    let tournamentStage: TournamentStage

    if (tournamentStages.length !== 0) {
      const lastTournamentStage = tournamentStages[tournamentStages.length - 1]

      const matches = await this.matchRepository.findManyByTournamentStageId(lastTournamentStage.id.toString())

      if (matches.some(match => !match.hasEnded())) {
        return left(new TournamentStageHasUnfinishedMatchesError())
      }

      tournamentStage = TournamentStage.create({
        tournamentId: tournament.id,
        stage: lastTournamentStage.stage + 1
      })
    }

    if (tournamentStages.length === 0) {
      tournamentStage = TournamentStage.create({
        tournamentId: tournament.id,
        stage: 1
      })

      await this.tournamentStageRepository.create(tournamentStage)
    }
    // * * generate the first round matches (stage 1)
    // * * generate the matches
    // * * save the matches
    // * * return the matches
    return right(null)
  }
}
