import { type UseCaseError } from '@/core/errors/use-case-error'

export class TournamentIsCanceledError extends Error implements UseCaseError {
  constructor () {
    super('Tournament is canceled.')
  }
}
