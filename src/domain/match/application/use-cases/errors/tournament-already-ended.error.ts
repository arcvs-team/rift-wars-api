import { type UseCaseError } from '@/core/errors/use-case-error'

export class TournamentAlreadyEndedError extends Error implements UseCaseError {
  constructor () {
    super('Tournament already ended.')
  }
}
