import { GraphQLServer } from './graphql/graphql-server'

async function bootstrap () {
  const apolloServer = new GraphQLServer()
  apolloServer.bootstrap()
}

bootstrap()
