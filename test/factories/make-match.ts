import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Match, type MatchAttributes } from '@/domain/match/enterprise/entities/match'
import { faker } from '@faker-js/faker'

export function makeMatch (
  override: Partial<MatchAttributes> = {},
  id?: UniqueEntityID
) {
  const match = Match.create(
    {
      tournamentId: new UniqueEntityID(faker.string.uuid()),
      tournamentStageId: new UniqueEntityID(faker.string.uuid()),
      riotTournamentCode: faker.string.uuid(),
      blueTeamId: new UniqueEntityID(faker.string.uuid()),
      redTeamId: new UniqueEntityID(faker.string.uuid()),
      blueTeamScore: undefined,
      redTeamScore: undefined,
      riotMatchId: undefined,
      winnerTeamId: undefined,
      winCondition: undefined,
      ...override
    },
    id
  )

  return match
}
