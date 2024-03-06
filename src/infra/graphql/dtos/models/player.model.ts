import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class PlayerModel {
  @Field(type => Int)
    id: number

  @Field({ description: 'O e-mail cadastrado do jogador' })
    email: string

  @Field()
    riotId: string

  @Field()
    createdAt: Date
}
