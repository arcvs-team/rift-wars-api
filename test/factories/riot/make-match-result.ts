import { type MatchData } from '@/domain/tournament/models/match-data'
import { faker } from '@faker-js/faker'

export function makeMatchResult (override: Partial<MatchData> = {}): Partial<MatchData> {
  const mergeDeep = (target: any, source: any) => {
    const isObject = (obj: any) => obj && typeof obj === 'object'
    if (!isObject(target) || !isObject(source)) {
      return source
    }
    const merged: any = { ...target }
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(merged, { [key]: source[key] })
        } else {
          merged[key] = mergeDeep(target[key], source[key])
        }
      } else {
        Object.assign(merged, { [key]: source[key] })
      }
    })
    return merged
  }

  const defaultMatchData = {
    metadata: {
      dataVersion: faker.number.int({ max: 9 }).toString(),
      matchId: faker.string.uuid(),
      participants: []
    },
    info: {
      endOfGameResult: 'GameComplete',
      gameCreation: faker.number.int(),
      gameDuration: faker.number.int(),
      gameEndTimestamp: faker.number.int(),
      gameId: faker.number.int(),
      gameMode: 'CLASSIC',
      gameName: faker.string.uuid(),
      gameStartTimestamp: faker.number.int(),
      gameType: 'MATCHED_GAME',
      gameVersion: '14.7',
      mapId: faker.number.int(),
      participants: [],
      platformId: 'BR1',
      queueId: faker.number.int(),
      teams: [],
      tournamentCode: faker.string.uuid()
    }
  }

  return mergeDeep(defaultMatchData, override)
}
