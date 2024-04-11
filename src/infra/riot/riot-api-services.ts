import 'reflect-metadata'
import 'dotenv/config'
import { inject, injectable } from 'inversify'
import { HttpClient } from '../http-client/http-client'
import { type MatchData } from './models/match-data'
import { type RiotApi } from './riot-api'

@injectable()
export class RiotApiServices implements RiotApi {
  constructor (
    @inject('HttpClient')
    private readonly httpClient: HttpClient
  ) {}

  async fetchMatch (matchId: string): Promise<MatchData> {
    const response = await this.httpClient.request<MatchData>({
      url: `${process.env.RIOT_BASE_URL}/lol/match/v5/matches/${matchId}`,
      method: 'get',
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      }
    })

    if (response.body === undefined) {
      throw new Error('Error fetching match data.')
    }

    return response.body
  }
}
