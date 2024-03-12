import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class TeamModel {
  @Field()
    id: string

  @Field()
    name: string

  @Field()
    createdAt: Date
}
