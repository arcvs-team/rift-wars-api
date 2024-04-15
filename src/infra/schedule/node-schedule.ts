import schedule from 'node-schedule'
import { container } from '../container/inversify'
import { type StartTournamentsUseCase } from '@/domain/tournament/application/use-cases/start-tournaments'
import { type GenerateMatchesUseCase } from '@/domain/match/application/use-cases/generate-matches'

const startTournamentUseCase: StartTournamentsUseCase = container.get('StartTournamentUseCase')
const generateMatchesUseCase: GenerateMatchesUseCase = container.get('GenerateMatchesUseCase')

export async function startSchedule () {
  schedule.scheduleJob('*/30 * * * *', async () => {
    const startTournamentsResult = await startTournamentUseCase.execute()

    if (startTournamentsResult.isLeft()) {
      console.error('Error on start tournament', startTournamentsResult.value)
      return
    }

    const { tournaments } = startTournamentsResult.value

    for (const tournament of tournaments) {
      const generateMatchesResult = await generateMatchesUseCase.execute({
        tournamentId: tournament.id.toString()
      })
      console.log(generateMatchesResult)
    }
  })
}
