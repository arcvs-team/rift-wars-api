import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateTournamentInput {
  @Field()
    name: string

  @Field()
    description?: string

  @Field()
    rules?: string

  @Field()
    startDate?: Date

  @Field()
    endDate?: Date

  @Field()
    minTeams?: number

  @Field()
    maxTeams?: number
}
