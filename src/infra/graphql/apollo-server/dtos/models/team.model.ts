import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class TeamModel {
  @Field(type => Int)
    id: number

  @Field()
    name: string

  @Field()
    createdAt: Date
}
