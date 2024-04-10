import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { buildSchema } from 'type-graphql'
import { PlayerResolver } from './graphql/apollo-server/resolvers/player.resolver'
import { TeamResolver } from './graphql/apollo-server/resolvers/team.resolver'
import { TournamentResolver } from './graphql/apollo-server/resolvers/tournament.resolver'
import path from 'path'
import { verify } from 'jsonwebtoken'
import { container } from '@/infra/container/inversify'
import { type FetchPlayerByIdUseCase } from '@/domain/player/application/use-cases/fetch-player-by-id'

async function server () {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = await buildSchema({
    resolvers: [
      PlayerResolver,
      TeamResolver,
      TournamentResolver
    ],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql')
  })

  // Set up Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })
  await server.start()

  app.use(
    cors(),
    express.json()
  )

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
      const accessToken = req.headers.authorization ?? ''

      if (accessToken === null || accessToken === undefined || accessToken.length === 0) return {}

      const [, token] = accessToken.split(' ')

      const decoded = verify(token, String(process.env.JWT_SECRET))

      const { sub } = decoded

      const fetchPlayerByIdUseCase: FetchPlayerByIdUseCase = container.get('FetchPlayerByIdUseCase')

      try {
        const result = await fetchPlayerByIdUseCase.execute({ userId: String(sub) })

        if (result.isRight()) {
          return { player: result.value.player }
        }

        return {}
      } catch {
        return {}
      }
    }
  }))

  httpServer.listen({ port: 4000 })
  console.log('🚀 Server ready at http://localhost:4000')
}

server()
