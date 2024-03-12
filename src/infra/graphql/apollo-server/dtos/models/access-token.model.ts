import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class AccessTokenModel {
  @Field()
    accessToken: string
}
