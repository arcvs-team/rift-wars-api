import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class TeamPlayerInviteModel {
  @Field()
    id: string

  @Field()
    playerId: string

  @Field()
    teamId: string

  @Field({ nullable: true })
    acceptedAt: Date

  @Field({ nullable: true })
    rejectedAt: Date

  @Field()
    invitedAt: Date

  @Field()
    invitedBy: string
}
