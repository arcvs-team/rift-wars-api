import 'reflect-metadata'
import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSchema } from 'type-graphql'

import { PlayerResolver } from './resolvers/player.resolver'
import { type GraphQLSchema } from 'graphql'

export class GraphQLServer {
  private schema: GraphQLSchema
  private readonly server: ApolloServer

  bootstrap () {
    this.buildSchema()
  }

  async buildSchema () {
    this.schema = await buildSchema({
      resolvers: [
        PlayerResolver
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql')
    })
  }

  async startServer () {
    const server = new ApolloServer({
      schema: this.schema
    })

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 }
    })

    console.log(`🚀  Server ready at: ${url}`)
  }
}
