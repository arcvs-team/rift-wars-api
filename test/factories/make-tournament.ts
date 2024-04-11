import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tournament, type TournamentAttributes } from '@/domain/tournament/enterprise/entities/tournament'
import { faker } from '@faker-js/faker'

export function makeTournament (
  override: Partial<TournamentAttributes> = {},
  id?: UniqueEntityID
) {
  const tournament = Tournament.create(
    {
      name: faker.word.words(2),
      providerId: new UniqueEntityID(faker.string.uuid()),
      riotTournamentId: faker.number.int({ min: 1000, max: 9999 }),
      description: faker.lorem.sentences({ max: 20, min: 10 }),
      rules: faker.lorem.sentences({ max: 20, min: 10 }),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      winnerTeamId: new UniqueEntityID(faker.string.uuid()),
      minTeams: faker.number.int({ min: 1, max: 5 }) * 2,
      maxTeams: faker.number.int({ min: 6, max: 10 }) * 2,
      createdBy: new UniqueEntityID(faker.string.uuid()),
      ...override
    },
    id
  )

  return tournament
}
