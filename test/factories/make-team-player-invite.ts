import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TeamPlayerInvite, type TeamPlayerInviteAttributes } from '@/domain/team/enterprise/entities/team-player-invite'
import { faker } from '@faker-js/faker'

export function makeTeamPlayerInvite (
  override: Partial<TeamPlayerInviteAttributes> = {},
  id?: UniqueEntityID
) {
  const teamPlayerInvite = TeamPlayerInvite.create(
    {
      playerId: new UniqueEntityID(faker.string.uuid()),
      teamId: new UniqueEntityID(faker.string.uuid()),
      invitedBy: new UniqueEntityID(faker.string.uuid()),
      ...override
    },
    id
  )

  return teamPlayerInvite
}
