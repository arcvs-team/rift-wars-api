import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateTeamPlayerInviteInput {
  @Field()
    playerId: string

  @Field()
    teamId: string
}
