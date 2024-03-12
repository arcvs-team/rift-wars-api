import { Field, InputType } from 'type-graphql'

@InputType()
export class AuthenticateInput {
  @Field()
    email: string

  @Field()
    password: string
}
