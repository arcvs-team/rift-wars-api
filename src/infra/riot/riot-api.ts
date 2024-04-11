import { type FetchMatch } from './actions/fetch-match'
import { type MatchData } from './models/match-data'

export abstract class RiotApi implements FetchMatch {
  abstract fetchMatch: (matchId: string) => Promise<MatchData>
}
