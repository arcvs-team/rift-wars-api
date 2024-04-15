import schedule from 'node-schedule'
import { container } from '../container/inversify'
import { type StartTournamentsUseCase } from '@/domain/tournament/application/use-cases/start-tournaments'
import { type GenerateFirstStageMatchesUseCase } from '@/domain/match/application/use-cases/generate-first-stage-matches'

const startTournamentUseCase: StartTournamentsUseCase = container.get('StartTournamentUseCase')
const generateFirstStageMatchesUseCase: GenerateFirstStageMatchesUseCase = container.get('GenerateFirstStageMatchesUseCase')

export async function startSchedule () {
  schedule.scheduleJob('* * * * *', async () => {
    const startTournamentsResult = await startTournamentUseCase.execute()

    if (startTournamentsResult.isLeft()) {
      console.error('Error on start tournament', startTournamentsResult.value)
      return
    }

    const { tournaments } = startTournamentsResult.value

    for (const tournament of tournaments) {
      const generateMatchesResult = await generateFirstStageMatchesUseCase.execute({
        tournamentId: tournament.id.toString()
      })
      console.log(generateMatchesResult)
    }
  })
}
