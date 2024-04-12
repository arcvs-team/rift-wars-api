import { type UseCaseError } from '@/core/errors/use-case-error'

export class PlayerNotFoundError extends Error implements UseCaseError {
  constructor () {
    super('Player not found.')
  }
}
