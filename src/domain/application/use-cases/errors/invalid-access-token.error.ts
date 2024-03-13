import { type UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAccessTokenError extends Error implements UseCaseError {
  constructor () {
    super('Invalid access token.')
  }
}
