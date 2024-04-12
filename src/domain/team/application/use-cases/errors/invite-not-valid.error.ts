import { type UseCaseError } from '@/core/errors/use-case-error'

export class InviteNotValidError extends Error implements UseCaseError {
  constructor () {
    super('This invite is not valid.')
  }
}
