import 'reflect-metadata'
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
import { TournamentTeamRepository } from '@/domain/team/application/repositories/tournament-team-repository'
import { type TournamentTeam } from '@/domain/team/enterprise/entities/tournament-team'
import { Match } from '../../enterprise/entities/match'

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
    private readonly matchRepository: MatchRepository,

    @inject('TournamentTeamRepository')
    private readonly tournamentTeamRepository: TournamentTeamRepository
  ) {}

  async execute ({ tournamentId }: GenerateMatchesParams): Promise<GenerateMatchesResult> {
    const tournament = await this.tournamentRepository.findById(tournamentId)

    if (!tournament) {
      return left(new TournamentNotFoundError())
    }

    if (tournament.isCanceled()) {
      return left(new TournamentIsCanceledError())
    }

    if (tournament.hasEnded()) {
      return left(new TournamentAlreadyEndedError())
    }

    if (!tournament.hasStarted()) {
      return left(new TournamentNotStartedError())
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

    const matches: Match[] = []

    if (tournament.stages === 0) {
      const tournamentTeams = await this.tournamentTeamRepository.findManyByTournamentId(tournamentId)
      const shuffledTournamentTeams = this.shuffleArray<TournamentTeam>(tournamentTeams)

      if (tournamentTeams.length % 2 !== 0) {
        const teamWithWoWin = shuffledTournamentTeams.shift()!
        matches.push(Match.create({
          tournamentId: tournament.id,
          // @ts-expect-error it was assigned already
          tournamentStageId: tournamentStage.id,
          riotTournamentCode: '',
          blueTeamId: teamWithWoWin.teamId,
          blueTeamScore: 1,
          winnerTeamId: teamWithWoWin.teamId,
          winCondition: 'wo'
        }))
      }

      for (let i = 0; i < shuffledTournamentTeams.length; i += 2) {
        matches.push(Match.create({
          tournamentId: tournament.id,
          // @ts-expect-error it was assigned already
          tournamentStageId: tournamentStage.id,
          riotTournamentCode: '',
          blueTeamId: shuffledTournamentTeams[i].teamId,
          redTeamId: shuffledTournamentTeams[i + 1].teamId
        }))
      }
    }

    const matchPromises: Array<Promise<void>> = []

    for (const match of matches) {
      matchPromises.push(this.matchRepository.create(match))
    }

    await Promise.all(matchPromises)

    return right(null)
  }

  shuffleArray<T> (array: T[]) {
    function compare () {
      return Math.random() - 0.5
    }

    return array.sort(compare)
  }
}
