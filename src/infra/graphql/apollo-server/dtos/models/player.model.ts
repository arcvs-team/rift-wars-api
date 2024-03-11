import { Field, ObjectType } from 'type-graphql'
import { TeamModel } from './team.model'

@ObjectType()
export class PlayerModel {
  @Field()
    id: string

  @Field()
    email: string

  @Field()
    riotId: string

  @Field()
    createdAt: Date

  @Field(() => [TeamModel])
    ownedTeams: TeamModel[]
}
