import { type UseCaseError } from '@/core/errors/use-case-error'

export class ActiveRiotTournamentProviderNotFoundError extends Error implements UseCaseError {
  constructor () {
    super('No active tournament provider was found.')
  }
}
