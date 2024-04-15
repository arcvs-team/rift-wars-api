import 'reflect-metadata'
import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/protocols/use-case'
import { inject, injectable } from 'inversify'
import { TournamentRepository } from '../repositories/tournament-repository'
import { type Tournament } from '../../enterprise/entities/tournament'
import { TournamentTeamRepository } from '@/domain/team/application/repositories/tournament-team-repository'

type StartTournamentsResult = Either<null, {
  tournaments: Tournament[]
}>

@injectable()
export class StartTournamentsUseCase implements UseCase {
  constructor (
    @inject('TournamentRepository')
    private readonly tournamentRepository: TournamentRepository,

    @inject('TournamentTeamRepository')
    private readonly tournamentTeamRepository: TournamentTeamRepository
  ) {}

  async execute (): Promise<StartTournamentsResult> {
    const publicTournaments = await this.tournamentRepository.findPublicTournamentsAfterNow()
    const startedTournaments: Tournament[] = []

    for (const tournament of publicTournaments) {
      const teams = await this.tournamentTeamRepository.findManyByTournamentId(tournament.id.toString())

      if (tournament.minTeams !== undefined && teams.length < tournament.minTeams) {
        tournament.cancel()
        await this.tournamentRepository.save(tournament)
        continue
      }

      tournament.start()
      await this.tournamentRepository.save(tournament)
      startedTournaments.push(tournament)
    }

    return right({
      tournaments: startedTournaments
    })
  }
}
