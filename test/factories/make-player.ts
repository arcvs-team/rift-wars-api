import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Player, type PlayerAttributes } from '@/domain/player/enterprise/entities/player'
import { faker } from '@faker-js/faker'

export function makePlayer (
  override: Partial<PlayerAttributes> = {},
  id?: UniqueEntityID
) {
  const player = Player.create(
    {
      riotId: `${faker.internet.userName().replace(/[^a-zA-Z0-9]/g, '')}#${faker.word.sample({ length: 4 })}`,
      riotPuuid: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override
    },
    id
  )

  return player
}
