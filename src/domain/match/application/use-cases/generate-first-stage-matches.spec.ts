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
import { TournamentStageHasUnfinishedMatchesError } from '@/domain/match/application/use-cases/errors/tournament-has-unfinished-matches.error'
import { makeMatch } from 'test/factories/make-match'
import { GenerateFirstStageMatchesUseCase } from '@/domain/match/application/use-cases/generate-first-stage-matches'

describe('generate matches', () => {
  let inMemoryTournamentRepository: InMemoryTournamentRepository
  let inMemoryTournamentStageRepository: InMemoryTournamentStageRepository
  let inMemoryMatchRepository: InMemoryMatchRepository
  let inMemoryTournamentTeamRepository: InMemoryTournamentTeamRepository
  let sut: GenerateFirstStageMatchesUseCase

  beforeEach(() => {
    inMemoryTournamentRepository = new InMemoryTournamentRepository()
    inMemoryTournamentStageRepository = new InMemoryTournamentStageRepository()
    inMemoryMatchRepository = new InMemoryMatchRepository()
    inMemoryTournamentTeamRepository = new InMemoryTournamentTeamRepository()
    sut = new GenerateFirstStageMatchesUseCase(inMemoryTournamentRepository, inMemoryTournamentStageRepository, inMemoryMatchRepository, inMemoryTournamentTeamRepository)
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

  it('should thrown an error if the previous tournament stage has unfinished matches', async () => {
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
    expect(result.value).toBeInstanceOf(TournamentStageHasUnfinishedMatchesError)
  })
})
