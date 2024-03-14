import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Team, type TeamAttributes } from '@/domain/team/enterprise/entities/team'
import { faker } from '@faker-js/faker'

export function makeTeam (
  override: Partial<TeamAttributes> = {},
  id?: UniqueEntityID
) {
  const team = Team.create(
    {
      name: faker.person.firstName(),
      createdBy: new UniqueEntityID(faker.string.uuid()),
      ...override
    },
    id
  )

  return team
}
