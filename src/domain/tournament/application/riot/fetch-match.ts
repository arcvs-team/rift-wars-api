import { type MatchData } from '../../models/match-data'

export interface FetchMatch {
  fetchMatch: (matchId: string) => Promise<MatchData>
}
