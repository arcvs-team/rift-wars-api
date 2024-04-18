import { type UseCaseError } from '@/core/errors/use-case-error'

export class PlayerDontBelongToTeamError extends Error implements UseCaseError {
  constructor () {
    super('This player does not belong to this team.')
  }
}
