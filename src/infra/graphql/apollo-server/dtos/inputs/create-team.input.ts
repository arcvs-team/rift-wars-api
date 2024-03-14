import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateTeamInput {
  @Field()
    name: string
}
