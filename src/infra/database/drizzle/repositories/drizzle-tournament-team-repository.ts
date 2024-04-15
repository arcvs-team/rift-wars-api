import { type TournamentTeamRepository } from '@/domain/team/application/repositories/tournament-team-repository'
import { type TournamentTeam } from '@/domain/team/enterprise/entities/tournament-team'
import { db } from '../connection'
import { tournamentTeams } from '../schema'
import { eq } from 'drizzle-orm'
import { DrizzleTournamentTeamMapper } from '../mappers/drizzle-tournament-team-mapper'

export class DrizzleTournamentTeamRepository implements TournamentTeamRepository {
  async findManyByTournamentId (tournamentId: string): Promise<TournamentTeam[]> {
    const result = await db.select().from(tournamentTeams).where(
      eq(tournamentTeams.tournamentId, tournamentId)
    )

    if (result.length === 0) {
      return []
    }

    return result.map(DrizzleTournamentTeamMapper.toDomain)
  }

  async create (tournamentTeam: TournamentTeam): Promise<void> {
    const data = DrizzleTournamentTeamMapper.toPersistence(tournamentTeam)
    await db.insert(tournamentTeams).values(data)
  }
}
