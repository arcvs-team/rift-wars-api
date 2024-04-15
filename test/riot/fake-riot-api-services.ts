import { type CreateTournamentCode, type CreateTournamentCodeParams } from '@/domain/match/application/riot/create-tournament-code'
import { type CreateTournamentParams, type CreateTournament } from '@/domain/tournament/application/riot/create-tournament'
import { type FetchMatch } from '@/domain/tournament/application/riot/fetch-match'
import { type MatchData } from '@/domain/tournament/models/match-data'
import { faker } from '@faker-js/faker'
import { makeMatchResult } from 'test/factories/riot/make-match-result'

export class FakeRiotApiServices implements FetchMatch, CreateTournament, CreateTournamentCode {
  async fetchMatch (matchId: string): Promise<MatchData> {
    const fakeData = makeMatchResult()
    return fakeData as MatchData
  }

  async createTournament (data: CreateTournamentParams): Promise<number> {
    const fakeTournamentId = faker.number.int({ min: 1, max: 100000 })
    return fakeTournamentId
  }

  async createTournamentCode ({ query }: CreateTournamentCodeParams): Promise<string[]> {
    const fakeTournamentCodes = Array.from({ length: query.count }, () => faker.string.uuid())
    return fakeTournamentCodes
  }
}
