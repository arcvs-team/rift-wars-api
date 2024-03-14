import { type TournamentRepository } from '@/domain/tournament/application/repositories/tournament-repository'
import { type Tournament } from '@/domain/tournament/enterprise/entities/tournament'

export class InMemoryTournamentRepository implements TournamentRepository {
  public items: Tournament[] = []

  async findMany (): Promise<Tournament[]> {
    return this.items
  }

  async create (tournament: Tournament): Promise<void> {
    this.items.push(tournament)
  }
}
