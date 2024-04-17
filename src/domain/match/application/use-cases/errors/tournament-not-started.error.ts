import { type UseCaseError } from '@/core/errors/use-case-error'

export class TournamentNotStartedError extends Error implements UseCaseError {
  constructor () {
    super('Tournament not started.')
  }
}
