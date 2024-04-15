import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TournamentTeam, type TournamentTeamAttributes } from '@/domain/team/enterprise/entities/tournament-team'
import { faker } from '@faker-js/faker'

export function makeTournamentTeam (
  override: Partial<TournamentTeamAttributes> = {},
  id?: UniqueEntityID
) {
  const tournamentTeam = TournamentTeam.create(
    {
      tournamentId: new UniqueEntityID(faker.string.uuid()),
      teamId: new UniqueEntityID(faker.string.uuid()),
      joinedAt: faker.date.recent(),
      ...override
    },
    id
  )

  return tournamentTeam
}
