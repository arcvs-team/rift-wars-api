import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RiotTournamentProvider, type RiotTournamentProviderAttributes } from '@/domain/tournament/enterprise/entities/riot-tournament-provider'
import { faker } from '@faker-js/faker'

export function makeRiotTournamentProvider (
  override: Partial<RiotTournamentProviderAttributes> = {},
  id?: UniqueEntityID
) {
  const riotTournamentProvider = RiotTournamentProvider.create(
    {
      providerId: faker.number.int({ min: 1, max: 10000 }),
      region: faker.lorem.word(),
      url: faker.internet.url(),
      isActive: true,
      ...override
    },
    id
  )

  return riotTournamentProvider
}
