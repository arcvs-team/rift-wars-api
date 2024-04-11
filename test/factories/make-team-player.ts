import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TeamPlayer, type TeamPlayerAttributes } from '@/domain/team/enterprise/entities/team-player'
import { faker } from '@faker-js/faker'

export function makeTeamPlayer (
  override: Partial<TeamPlayerAttributes> = {},
  id?: UniqueEntityID
) {
  const teamPlayer = TeamPlayer.create(
    {
      playerId: new UniqueEntityID(faker.string.uuid()),
      teamId: new UniqueEntityID(faker.string.uuid()),
      isCaptain: false,
      joinedAt: faker.date.recent(),
      ...override
    },
    id
  )

  return teamPlayer
}
