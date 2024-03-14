import 'reflect-metadata'
import 'dotenv/config'
import path from 'path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSchema } from 'type-graphql'

import { PlayerResolver } from './resolvers/player.resolver'
import { type GraphQLSchema } from 'graphql'
import { TeamResolver } from './resolvers/team.resolver'
import { TournamentResolver } from './resolvers/tournament.resolver'
import { verify } from 'jsonwebtoken'
import { container } from '@/infra/container/inversify'
import { type FetchPlayerByIdUseCase } from '@/domain/player/application/use-cases/fetch-player-by-id'

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
        TeamResolver,
        TournamentResolver
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
      listen: { port: 4000 },
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
    })

    console.log(`🚀  Server ready at: ${url}`)
  }
}
