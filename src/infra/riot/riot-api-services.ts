import 'reflect-metadata'
import 'dotenv/config'
import { inject, injectable } from 'inversify'
import { HttpClient } from '../http-client/http-client'
import { type FetchMatch } from '@/domain/tournament/application/riot/fetch-match'
import { type MatchData } from '@/domain/tournament/models/match-data'
import { type CreateTournamentParams, type CreateTournament } from '@/domain/tournament/application/riot/create-tournament'

@injectable()
export class RiotApiServices implements FetchMatch, CreateTournament {
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

    return response.body
  }

  async createTournament ({ name, providerId }: CreateTournamentParams): Promise<number> {
    const response = await this.httpClient.request<number>({
      url: `${process.env.RIOT_BASE_URL}/lol/tournament${process.env.NODE_ENV === 'production' ? '' : '-stub'}/v5/tournaments`,
      method: 'post',
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      },
      body: {
        name,
        providerId
      }
    })

    return response.body
  }
}
