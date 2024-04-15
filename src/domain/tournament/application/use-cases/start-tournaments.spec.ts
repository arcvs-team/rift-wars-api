import { InMemoryTournamentRepository } from 'test/repositories/in-memory-tournament-repository'
import { InMemoryTournamentTeamRepository } from 'test/repositories/in-memory-tournament-team-repository'
import { StartTournamentsUseCase } from './start-tournaments'
import { makeTournament } from 'test/factories/make-tournament'
import { faker } from '@faker-js/faker'
import { makeTournamentTeam } from 'test/factories/make-tournament-team'

describe('start tournaments', () => {
  let inMemoryTournamentRepository: InMemoryTournamentRepository
  let inMemoryTournamentTeamRepository: InMemoryTournamentTeamRepository
  let sut: StartTournamentsUseCase

  beforeEach(() => {
    inMemoryTournamentRepository = new InMemoryTournamentRepository()
    inMemoryTournamentTeamRepository = new InMemoryTournamentTeamRepository()
    sut = new StartTournamentsUseCase(inMemoryTournamentRepository, inMemoryTournamentTeamRepository)
  })

  it('should return an empty array if there are no public tournaments', async () => {
    const tournament = makeTournament({
      startDate: faker.date.past(),
      status: 'draft'
    })
    await inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.tournaments).toHaveLength(0)
    }
  })

  it('should return an empty array if there are no public tournaments before the start date', async () => {
    const tournament = makeTournament({
      startDate: faker.date.future(),
      status: 'public',
      minTeams: 0
    })
    await inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.tournaments).toHaveLength(0)
    }
  })

  it('should return an empty array if the public tournament does not have enough teams and cancel those tournaments', async () => {
    const tournament = makeTournament({
      startDate: faker.date.past(),
      status: 'public',
      minTeams: 2
    })
    await inMemoryTournamentRepository.create(tournament)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.tournaments).toHaveLength(0)
      expect(inMemoryTournamentRepository.items[0].status).toBe('finished')
      expect(inMemoryTournamentRepository.items[0].canceledAt).toBeTruthy()
    }
  })

  it('should be able to start the public tournament if it has enough teams', async () => {
    const tournament = makeTournament({
      startDate: faker.date.past(),
      status: 'public',
      minTeams: 2
    })
    await inMemoryTournamentRepository.create(tournament)
    const tournamentTeamBlue = makeTournamentTeam({ tournamentId: tournament.id })
    const tournamentTeamRed = makeTournamentTeam({ tournamentId: tournament.id })
    await inMemoryTournamentTeamRepository.create(tournamentTeamBlue)
    await inMemoryTournamentTeamRepository.create(tournamentTeamRed)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.tournaments).toHaveLength(1)
      expect(inMemoryTournamentRepository.items[0].status).toBe('started')
      expect(inMemoryTournamentTeamRepository.items).toHaveLength(2)
    }
  })
})
