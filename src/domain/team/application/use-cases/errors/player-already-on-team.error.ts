import { type UseCaseError } from '@/core/errors/use-case-error'

export class PlayerAlreadyOnTeamError extends Error implements UseCaseError {
  constructor () {
    super('This player is already on this team.')
  }
}
