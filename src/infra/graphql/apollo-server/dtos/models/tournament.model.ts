import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class TournamentModel {
  @Field()
    id: string

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
    winnerTeamId: string

  @Field({ nullable: true })
    minTeams: number

  @Field({ nullable: true })
    maxTeams: number

  @Field()
    status: string

  @Field()
    createdBy: string

  @Field()
    createdAt: string
}
