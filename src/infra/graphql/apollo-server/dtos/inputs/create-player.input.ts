import { Field, InputType } from 'type-graphql'

@InputType()
export class CreatePlayerInput {
  @Field()
    email: string

  @Field()
    riotId: string

  @Field()
    password: string
}
