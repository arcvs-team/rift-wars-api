import { Field, Int, ObjectType } from 'type-graphql'

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
}
