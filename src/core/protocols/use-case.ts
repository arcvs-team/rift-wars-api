import { type Either } from '../either'

export interface UseCase {
  execute: (params: any) => Promise<Either<any, any>>
}
