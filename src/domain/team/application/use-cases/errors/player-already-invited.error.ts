import { type UseCaseError } from '@/core/errors/use-case-error'

export class PlayerAlreadyInvitedError extends Error implements UseCaseError {
  constructor () {
    super('This player is already invited to this team.')
  }
}
