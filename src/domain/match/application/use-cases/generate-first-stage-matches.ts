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
import { TournamentTeamRepository } from '@/domain/team/application/repositories/tournament-team-repository'
import { type TournamentTeam } from '@/domain/team/enterprise/entities/tournament-team'
import { Match } from '../../enterprise/entities/match'
import { TournamentHaveStagesError } from '@/domain/match/application/use-cases/errors/tournament-have-stages.error'

interface GenerateFirstStageMatchesParams {
  tournamentId: string
}

type GenerateFirstStageMatchesResult = Either<TournamentNotFoundError | TournamentIsCanceledError | TournamentNotStartedError | TournamentAlreadyEndedError | TournamentHaveStagesError, null>

@injectable()
export class GenerateFirstStageMatchesUseCase implements UseCase {
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

  async execute ({ tournamentId }: GenerateFirstStageMatchesParams): Promise<GenerateFirstStageMatchesResult> {
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

    if (tournamentStages.length !== 0) {
      return left(new TournamentHaveStagesError())
    }

    const tournamentStage = TournamentStage.create({
      tournamentId: tournament.id,
      stage: 1
    })

    await this.tournamentStageRepository.create(tournamentStage)

    const matches: Match[] = []

    const tournamentTeams = await this.tournamentTeamRepository.findManyByTournamentId(tournamentId)
    const shuffledTournamentTeams = this.shuffleArray<TournamentTeam>(tournamentTeams)

    if (tournamentTeams.length % 2 !== 0) {
      const teamWithWoWin = shuffledTournamentTeams.shift()!
      matches.push(Match.create({
        tournamentId: tournament.id,
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
        tournamentStageId: tournamentStage.id,
        riotTournamentCode: '',
        blueTeamId: shuffledTournamentTeams[i].teamId,
        redTeamId: shuffledTournamentTeams[i + 1].teamId
      }))
    }

    const matchPromises: Array<Promise<void>> = []

    for (const match of matches) {
      matchPromises.push(this.matchRepository.create(match))
    }

    await Promise.all(matchPromises)

    tournament.stages = Math.ceil(Math.log2(tournamentTeams.length))
    await this.tournamentRepository.save(tournament)

    return right(null)
  }

  shuffleArray<T> (array: T[]) {
    function compare () {
      return Math.random() - 0.5
    }

    return array.sort(compare)
  }
}
