import { Field, Int, ObjectType } from 'type-graphql'
import { TeamModel } from './team.model'

@ObjectType()
export class PlayerModel {
  @Field(type => Int)
    id: number

  @Field()
    email: string

  @Field()
    riotId: string

  @Field()
    createdAt: Date

  @Field(() => [TeamModel])
    ownedTeams: TeamModel[]
}
