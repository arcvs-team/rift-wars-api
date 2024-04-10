import { buildSchema } from 'type-graphql'
import { PlayerResolver } from '@/infra/graphql/apollo-server/resolvers/player.resolver'
import { TeamResolver } from '@/infra/graphql/apollo-server/resolvers/team.resolver'
import { TournamentResolver } from '@/infra/graphql/apollo-server/resolvers/tournament.resolver'
import path from 'path'
import { type GraphQLSchema } from 'graphql'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import type http from 'http'

export class ApolloGraphQLServer {
  private schema: GraphQLSchema
  private readonly httpServer: http.Server
  private server: ApolloServer

  constructor (httpServer: http.Server) {
    this.httpServer = httpServer
  }

  async buildSchema () {
    this.schema = await buildSchema({
      resolvers: [
        PlayerResolver,
        TeamResolver,
        TournamentResolver
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql')
    })
  }

  async setupServer () {
    this.server = new ApolloServer({
      schema: this.schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })]
    })
    await this.server.start()
  }

  getServer () {
    return this.server
  }
}
