import { type UseCaseError } from '@/core/errors/use-case-error'

export class TournamentHaveStagesError extends Error implements UseCaseError {
  constructor () {
    super('This tournament already have stages created.')
  }
}
