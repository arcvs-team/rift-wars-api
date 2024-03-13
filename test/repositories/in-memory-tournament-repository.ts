import { type TournamentRepository } from '@/domain/application/repositories/tournament-repository'
import { type Tournament } from '@/domain/enterprise/tournament'

export class InMemoryTournamentRepository implements TournamentRepository {
  public items: Tournament[] = []

  async findMany (): Promise<Tournament[]> {
    return this.items
  }

  async create (tournament: Tournament): Promise<void> {
    this.items.push(tournament)
  }
}
