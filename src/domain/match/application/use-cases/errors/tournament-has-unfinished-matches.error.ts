import { type UseCaseError } from '@/core/errors/use-case-error'

export class TournamentStageHasUnfinishedMatchesError extends Error implements UseCaseError {
  constructor () {
    super('Tournament stage has unfinished matches.')
  }
}
