import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateTournamentInput {
  @Field()
    name: string

  @Field({ nullable: true })
    description: string

  @Field({ nullable: true })
    rules: string

  @Field({ nullable: true })
    startDate: Date

  @Field({ nullable: true })
    endDate: Date

  @Field({ nullable: true })
    minTeams: number

  @Field({ nullable: true })
    maxTeams: number
}
