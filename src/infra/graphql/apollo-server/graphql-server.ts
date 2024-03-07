import 'reflect-metadata'
import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSchema } from 'type-graphql'

import { PlayerResolver } from './resolvers/player.resolver'
import { type GraphQLSchema } from 'graphql'
import { TeamResolver } from './resolvers/team.resolver'

export class GraphQLServer {
  private schema: GraphQLSchema
  private server: ApolloServer

  async bootstrap () {
    await this.buildSchema()
    await this.createServer()
    await this.startServer()
  }

  async buildSchema () {
    this.schema = await buildSchema({
      resolvers: [
        PlayerResolver,
        TeamResolver
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql')
    })
  }

  async createServer () {
    this.server = new ApolloServer({
      schema: this.schema
    })
  }

  async startServer () {
    const { url } = await startStandaloneServer(this.server, {
      listen: { port: 4000 }
    })

    console.log(`🚀  Server ready at: ${url}`)
  }
}
