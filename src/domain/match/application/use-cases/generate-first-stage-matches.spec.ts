import { InMemoryMatchRepository } from 'test/repositories/in-memory-match-repository'
import { InMemoryTournamentRepository } from 'test/repositories/in-memory-tournament-repository'
import { InMemoryTournamentStageRepository } from 'test/repositories/in-memory-tournament-stage-repository'
import { InMemoryTournamentTeamRepository } from 'test/repositories/in-memory-tournament-team-repository'
import { TournamentNotFoundError } from './errors/tournament-not-found.error'
import { TournamentIsCanceledError } from './errors/tournament-is-canceled'
import { makeTournament } from 'test/factories/make-tournament'
import { TournamentNotStartedError } from './errors/tournament-not-started.error'
import { TournamentAlreadyEndedError } from './errors/tournament-already-ended.error'
import { makeTournamentStage } from 'test/factories/make-tournament-stage'
import { makeMatch } from 'test/factories/make-match'
import { GenerateFirstStageMatchesUseCase } from '@/domain/match/application/use-cases/generate-first-stage-matches'
import { TournamentHaveStagesError } from './errors/tournament-have-stages.error'
import { FakeRiotApiServices } from 'test/riot/fake-riot-api-services'
import { InMemoryTeamPlayerRepository } from 'test/repositories/in-memory-team-player-repository'
import { InMemoryPlayerRepository } from 'test/repositories/in-memory-player-repository'
import { makeTournamentTeam } from 'test/factories/make-tournament-team'
import { makeTeamPlayer } from 'test/factories/make-team-player'
import { makePlayer } from 'test/factories/make-player'

describe('generate matches', () => {
  let inMemoryTournamentRepository: InMemoryTournamentRepository
  let inMemoryTournamentStageRepository: InMemoryTournamentStageRepository
  let inMemoryMatchRepository: InMemoryMatchRepository
  let inMemoryTournamentTeamRepository: InMemoryTournamentTeamRepository
  let inMemoryTeamPlayerRepository: InMemoryTeamPlayerRepository
  let inMemoryPlayerRepository: InMemoryPlayerRepository
  let fakeCreateTournamentCodeService: FakeRiotApiServices
  let sut: GenerateFirstStageMatchesUseCase

  beforeEach(() => {
    inMemoryTournamentRepository = new InMemoryTournamentRepository()
    inMemoryTournamentStageRepository = new InMemoryTournamentStageRepository()
    inMemoryMatchRepository = new InMemoryMatchRepository()
    inMemoryTournamentTeamRepository = new InMemoryTournamentTeamRepository()
    inMemoryTeamPlayerRepository = new InMemoryTeamPlayerRepository()
    inMemoryPlayerRepository = new InMemoryPlayerRepository()
    fakeCreateTournamentCodeService = new FakeRiotApiServices()

    sut = new GenerateFirstStageMatchesUseCase(
      inMemoryTournamentRepository,
      inMemoryTournamentStageRepository,
      inMemoryMatchRepository,
      inMemoryTournamentTeamRepository,
      inMemoryTeamPlayerRepository,
      inMemoryPlayerRepository,
      fakeCreateTournamentCodeService
    )
  })

  it('should throw an error if the tournament did not exists', async () => {
    const result = await sut.execute({ tournamentId: 'non-existing-tournament-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TournamentNotFoundError)
  })

  it('should thrown an error if the tournament is cancelled', async () => {
    const tournament = makeTournament({
      canceledAt: new Date(),
      status: 'finished'
    })
    inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TournamentIsCanceledError)
  })

  it('should thrown an error if the tournament did not started', async () => {
    const tournament = makeTournament({
      startDate: undefined,
      status: 'draft'
    })
    inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TournamentNotStartedError)
  })

  it('should thrown an error if the tournament is already ended', async () => {
    const tournament = makeTournament({
      startDate: new Date(),
      status: 'finished'
    })
    inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TournamentAlreadyEndedError)
  })

  it('should thrown an error if the tournament stage count matches the current tournament stage', async () => {
    const tournament = makeTournament({
      startDate: new Date(),
      status: 'started',
      stages: 1
    })
    inMemoryTournamentRepository.create(tournament)
    const tournamentStage = makeTournamentStage({ tournamentId: tournament.id })
    inMemoryTournamentStageRepository.create(tournamentStage)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TournamentAlreadyEndedError)
  })

  it('should thrown an error if there is any tournament stages', async () => {
    const tournament = makeTournament({
      startDate: new Date(),
      status: 'started',
      stages: 2
    })
    inMemoryTournamentRepository.create(tournament)
    const tournamentStage = makeTournamentStage({ tournamentId: tournament.id })
    inMemoryTournamentStageRepository.create(tournamentStage)
    const match = makeMatch({
      tournamentId: tournament.id,
      tournamentStageId: tournamentStage.id
    })
    inMemoryMatchRepository.create(match)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TournamentHaveStagesError)
  })

  it('should generate the first stage matches with 3 teams', async () => {
    const tournament = makeTournament({
      startDate: new Date(),
      status: 'started'
    })
    inMemoryTournamentRepository.create(tournament)
    const tournamentWoTeam = makeTournamentTeam({ tournamentId: tournament.id })
    inMemoryTournamentTeamRepository.create(tournamentWoTeam)
    const tournamentBlueTeam = makeTournamentTeam({ tournamentId: tournament.id })
    inMemoryTournamentTeamRepository.create(tournamentBlueTeam)
    const tournamentRedTeam = makeTournamentTeam({ tournamentId: tournament.id })
    inMemoryTournamentTeamRepository.create(tournamentRedTeam)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTournamentRepository.items[0].stages).toBe(2)
    expect(inMemoryMatchRepository.items.length).toBe(2)
  })

  it('should generate the first stage with the players', async () => {
    const tournament = makeTournament({
      startDate: new Date(),
      status: 'started'
    })
    inMemoryTournamentRepository.create(tournament)
    const tournamentBlueTeam = makeTournamentTeam({ tournamentId: tournament.id })
    inMemoryTournamentTeamRepository.create(tournamentBlueTeam)
    const tournamentRedTeam = makeTournamentTeam({ tournamentId: tournament.id })
    inMemoryTournamentTeamRepository.create(tournamentRedTeam)
    const player = makePlayer()
    inMemoryPlayerRepository.create(player)
    const blueTeamPlayer = makeTeamPlayer({ teamId: tournamentBlueTeam.teamId, playerId: player.id })
    inMemoryTeamPlayerRepository.create(blueTeamPlayer)

    const result = await sut.execute({ tournamentId: tournament.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTournamentRepository.items[0].stages).toBe(1)
    expect(inMemoryMatchRepository.items.length).toBe(1)
  })
})
