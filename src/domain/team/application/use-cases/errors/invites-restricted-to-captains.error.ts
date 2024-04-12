import { type UseCaseError } from '@/core/errors/use-case-error'

export class InvitesRestrictedToCaptainsError extends Error implements UseCaseError {
  constructor () {
    super('You can only invite someone if you are the captain of the team.')
  }
}
