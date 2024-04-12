import { Field, InputType } from 'type-graphql'

@InputType()
export class AcceptTeamPlayerInviteInput {
  @Field()
    teamPlayerInviteId: string
}
