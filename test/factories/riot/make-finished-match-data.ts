import { type FinishedMatchData } from '@/domain/tournament/models/finished-match-data'
import { faker } from '@faker-js/faker'

export function makeFinishedMatchData (override: Partial<FinishedMatchData> = {}): FinishedMatchData {
  return {
    startTime: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
    shortCode: 'BR' + faker.string.uuid(),
    metaData: '{"title":"Game 42 - Finals"}',
    gameId: faker.number.int({ min: 1000000000, max: 9999999999 }),
    gameName: faker.string.uuid(),
    gameType: 'MATCHED_GAME',
    gameMap: faker.number.int({ min: 1, max: 20 }),
    gameMode: 'CLASSIC',
    region: 'BR1',
    ...override
  }
}
