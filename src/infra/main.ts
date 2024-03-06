import { GraphQLServer } from './graphql/graphql-server'

async function bootstrap () {
  const graphqlServer = new GraphQLServer()
  graphqlServer.bootstrap()
}

bootstrap()
