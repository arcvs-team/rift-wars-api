import 'reflect-metadata'
import { ApolloGraphQLServer } from './graphql/apollo-server/apollo-graphql-server'
import { ExpressHttpServer } from './http-server/express/express-http-server'

async function bootstrap () {
  const expressHttpServer = new ExpressHttpServer()

  const apolloGraphQLServer = new ApolloGraphQLServer(expressHttpServer.getHttpServer())
  await apolloGraphQLServer.buildSchema()
  await apolloGraphQLServer.setupServer()

  const apolloServer = apolloGraphQLServer.getServer()

  expressHttpServer.configureMiddleware(apolloServer)
  expressHttpServer.start()
}

bootstrap()
