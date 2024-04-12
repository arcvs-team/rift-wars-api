import { Field, InputType } from 'type-graphql'

@InputType()
export class RejectTeamPlayerInviteInput {
  @Field()
    teamPlayerInviteId: string
}
