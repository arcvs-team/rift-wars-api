import { type UseCaseError } from '@/core/errors/use-case-error'

export class InviteNotFoundError extends Error implements UseCaseError {
  constructor () {
    super('Invite not found.')
  }
}
