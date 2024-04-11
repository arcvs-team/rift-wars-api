import { type CreateTournamentParams, type CreateTournament } from '@/domain/tournament/application/riot/create-tournament'
import { type FetchMatch } from '@/domain/tournament/application/riot/fetch-match'
import { type MatchData } from '@/domain/tournament/models/match-data'
import { faker } from '@faker-js/faker'
import { makeMatchResult } from 'test/factories/riot/make-match-result'

export class FakeRiotApiServices implements FetchMatch, CreateTournament {
  async fetchMatch (matchId: string): Promise<MatchData> {
    const fakeData = makeMatchResult()
    return fakeData as MatchData
  }

  async createTournament (data: CreateTournamentParams): Promise<number> {
    const fakeTournamentId = faker.number.int({ min: 1, max: 100000 })
    return fakeTournamentId
  }
}
