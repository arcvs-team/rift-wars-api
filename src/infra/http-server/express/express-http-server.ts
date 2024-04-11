import express, { type Application } from 'express'
import cors from 'cors'
import http from 'http'
import { expressMiddleware } from '@apollo/server/express4'
import { verify } from 'jsonwebtoken'
import { container } from '@/infra/container/inversify'
import { type FetchPlayerByIdUseCase } from '@/domain/player/application/use-cases/fetch-player-by-id'
import { type ApolloServer } from '@apollo/server'

export class ExpressHttpServer {
  private readonly app: Application
  private readonly httpServer: http.Server
  private apolloServer: ApolloServer

  constructor () {
    this.app = express()
    this.httpServer = http.createServer(this.app)
  }

  public configureMiddleware (apolloServer: ApolloServer) {
    this.apolloServer = apolloServer
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use('/graphql', expressMiddleware(this.apolloServer, {
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
  }

  public start () {
    this.httpServer.listen(4000, () => {
      console.log(`🚀 Express Server ready at http://localhost:${4000}`)
    })
  }

  public getHttpServer () {
    return this.httpServer
  }
}
