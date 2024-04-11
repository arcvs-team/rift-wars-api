import { type MatchData } from '@/infra/riot/models/match-data'
import { type RiotApi } from '@/infra/riot/riot-api'
import { makeMatchResult } from 'test/factories/riot/make-match-result'

export class FakeRiotApiServices implements RiotApi {
  async fetchMatch (matchId: string): Promise<MatchData> {
    const fakeData = makeMatchResult()
    return fakeData as MatchData
  }
}
