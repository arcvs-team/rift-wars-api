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
import { CreateTournamentCode } from '../riot/create-tournament-code'
import { shuffleArray } from '@/core/utils/shuffle-array'
import { TeamPlayerRepository } from '@/domain/team/application/repositories/team-player-repository'
import { PlayerRepository } from '@/domain/player/application/repositories/player-repository'

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
    private readonly tournamentTeamRepository: TournamentTeamRepository,

    @inject('TeamPlayerRepository')
    private readonly teamPlayerRepository: TeamPlayerRepository,

    @inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository,

    @inject('CreateTournamentCode')
    private readonly createTournamentCodeService: CreateTournamentCode
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
    const shuffledTournamentTeams = shuffleArray<TournamentTeam>(tournamentTeams)

    if (tournamentTeams.length % 2 !== 0) {
      const teamWithWoWin = shuffledTournamentTeams.shift()!
      matches.push(Match.create({
        tournamentId: tournament.id,
        tournamentStageId: tournamentStage.id,
        blueTeamId: teamWithWoWin.teamId,
        blueTeamScore: 1,
        winnerTeamId: teamWithWoWin.teamId,
        winCondition: 'wo'
      }))
    }

    for (let i = 0; i < shuffledTournamentTeams.length; i += 2) {
      const blueTeamPlayers = await this.teamPlayerRepository.findManyByTeamId(shuffledTournamentTeams[i].teamId.toString())
      const redTeamPlayers = await this.teamPlayerRepository.findManyByTeamId(shuffledTournamentTeams[i + 1].teamId.toString())
      const teamPlayers = blueTeamPlayers.concat(redTeamPlayers)

      const playersRiotPuuid: string[] = []

      for (const teamPlayer of teamPlayers) {
        const player = (await this.playerRepository.findById(teamPlayer.playerId.toString()))!
        playersRiotPuuid.push(player.riotPuuid)
      }

      const riotTournamentCodes = await this.createTournamentCodeService.createTournamentCode({
        body: {
          allowedParticipants: playersRiotPuuid,
          metadata: '',
          teamSize: 5,
          pickType: 'TOURNAMENT_DRAFT',
          mapType: 'SUMMONERS_RIFT',
          spectatorType: 'NONE',
          enoughPlayers: true
        },
        query: {
          count: 1,
          tournamentId: tournament.riotTournamentId
        }
      })

      matches.push(Match.create({
        tournamentId: tournament.id,
        tournamentStageId: tournamentStage.id,
        riotTournamentCode: riotTournamentCodes[0],
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
}
