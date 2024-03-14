import 'reflect-metadata'
import { injectable } from 'inversify'
import { type UseCase } from '@/core/protocols/use-case'

@injectable()
export class FetchTeams implements UseCase {
  async execute (): Promise<any> {}
}
