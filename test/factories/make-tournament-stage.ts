import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TournamentStage, type TournamentStageAttributes } from '@/domain/tournament/enterprise/entities/tournament-stage'
import { faker } from '@faker-js/faker'

export function makeTournamentStage (
  override: Partial<TournamentStageAttributes> = {},
  id?: UniqueEntityID
) {
  const tournamentStage = TournamentStage.create(
    {
      tournamentId: new UniqueEntityID(faker.string.uuid()),
      stage: faker.number.int({ min: 1, max: 20 }),
      createdAt: faker.date.recent(),
      ...override
    },
    id
  )

  return tournamentStage
}
