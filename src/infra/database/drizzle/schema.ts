import { sql } from 'drizzle-orm'
import { mysqlTable, uniqueIndex, varchar, datetime, bigint, longtext, int, mysqlEnum } from 'drizzle-orm/mysql-core'

export const players = mysqlTable('players', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  email: varchar('email', { length: 256 }).notNull(),
  riotId: varchar('riot_id', { length: 256 }).notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (players) => ({
  emailIndex: uniqueIndex('email_idx').on(players.email),
  riotIdIndex: uniqueIndex('riot_id_idx').on(players.riotId)
}))

export const teams = mysqlTable('teams', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull(),
  createdBy: bigint('created_by', { mode: 'number' }).notNull().references(() => players.id),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`)
})

export const teamPlayers = mysqlTable('team_players', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  playerId: bigint('player_id', { mode: 'number' }).notNull().references(() => players.id),
  teamId: bigint('team_id', { mode: 'number' }).notNull().references(() => teams.id),
  joinedAt: datetime('joined_at').default(sql`CURRENT_TIMESTAMP`),
  removedAt: datetime('removed_at'),
  removedBy: bigint('removed_by', { mode: 'number' }).references(() => players.id)
})

export const tournaments = mysqlTable('tournaments', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }).notNull(),
  description: longtext('description'),
  rules: longtext('description'),
  startDate: datetime('start_date'),
  endDate: datetime('end_date'),
  winnerTeamId: bigint('winner_team_id', { mode: 'number' }).references(() => teams.id),
  minTeams: int('min_teams'),
  maxTeams: int('max_teams'),
  status: mysqlEnum('status', ['draft', 'public', 'finished']).default('draft'),
  createdBy: bigint('created_by', { mode: 'number' }).notNull().references(() => players.id),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`)
})

export const tournamentTabs = mysqlTable('tournament_tabs', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  tournamentId: bigint('tournament_id', { mode: 'number' }).notNull().references(() => tournaments.id),
  name: varchar('name', { length: 256 }).notNull(),
  description: longtext('description').notNull(),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`)
})

export const tournamentTeams = mysqlTable('tournament_teams', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  tournamentId: bigint('tournament_id', { mode: 'number' }).notNull().references(() => tournaments.id),
  teamId: bigint('team_id', { mode: 'number' }).notNull().references(() => teams.id),
  joinedAt: datetime('joined_at').default(sql`CURRENT_TIMESTAMP`),
  withdrawAt: datetime('withdraw_at')
})

export const matches = mysqlTable('matches', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  tournamentId: bigint('tournament_id', { mode: 'number' }).notNull().references(() => tournaments.id),
  blueTeamId: bigint('blue_team_id', { mode: 'number' }).notNull().references(() => teams.id),
  redTeamId: bigint('red_team_id', { mode: 'number' }).notNull().references(() => teams.id),
  blueTeamScore: int('blue_team_score'),
  redTeamScore: int('red_team_score'),
  riotMatchId: bigint('riot_match_id', { mode: 'number' }),
  winnerTeamId: bigint('winner_team_id', { mode: 'number' }).references(() => teams.id),
  winCondition: mysqlEnum('win_condition', ['normal', 'wo', 'ff']),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`)
})
