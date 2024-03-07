import { GraphQLServer } from './graphql/apollo-server/graphql-server'

async function bootstrap () {
  const graphqlServer = new GraphQLServer()
  graphqlServer.bootstrap()
}

bootstrap()
