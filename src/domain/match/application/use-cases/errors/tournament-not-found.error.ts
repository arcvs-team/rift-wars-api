import { type UseCaseError } from '@/core/errors/use-case-error'

export class TournamentNotFoundError extends Error implements UseCaseError {
  constructor () {
    super('Tournament not found.')
  }
}
