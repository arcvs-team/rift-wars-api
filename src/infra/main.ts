import 'reflect-metadata'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { PlayerResolver } from './graphql/resolvers/player.resolver'

async function bootstrap () {
  const schema = await buildSchema({
    resolvers: [
      PlayerResolver
    ],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql')
  })

  const server = new ApolloServer({
    schema
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })

  console.log(`🚀  Server ready at: ${url}`)
}

bootstrap()
