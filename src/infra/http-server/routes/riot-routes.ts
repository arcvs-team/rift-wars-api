import { Router } from 'express'
import { ExpressRiotGameResultController } from '../controllers/express-riot-game-result-controller'

const expressRiotGameResultController = new ExpressRiotGameResultController()

const riotRouter = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
riotRouter.post('/game-result', expressRiotGameResultController.handle)

export { riotRouter }
