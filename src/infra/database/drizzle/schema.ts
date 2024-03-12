import { text, integer, uniqueIndex, pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull(),
  riotId: varchar('riot_id', { length: 256 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (players) => ({
  emailIndex: uniqueIndex('email_idx').on(players.email),
  riotIdIndex: uniqueIndex('riot_id_idx').on(players.riotId)
}))
export type DrizzlePlayer = typeof players.$inferSelect

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  createdBy: uuid('created_by').notNull().references(() => players.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
export type DrizzleTeam = typeof teams.$inferSelect

export const teamPlayers = pgTable('team_players', {
  id: uuid('id').primaryKey(),
  playerId: uuid('player_id').notNull().references(() => players.id),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  joinedAt: timestamp('joined_at').defaultNow(),
  removedAt: timestamp('removed_at'),
  removedBy: uuid('removed_by').references(() => players.id)
})
export type DrizzleTeamPlayer = typeof teamPlayers.$inferSelect

export const tournaments = pgTable('tournaments', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  rules: text('description'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  winnerTeamId: uuid('winner_team_id').references(() => teams.id),
  minTeams: integer('min_teams'),
  maxTeams: integer('max_teams'),
  status: text('status', { enum: ['draft', 'public', 'finished'] }),
  createdBy: uuid('created_by').notNull().references(() => players.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
export type DrizzleTournament = typeof tournaments.$inferSelect

export const tournamentTabs = pgTable('tournament_tabs', {
  id: uuid('id').primaryKey(),
  tournamentId: uuid('tournament_id').notNull().references(() => tournaments.id),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
export type DrizzleTournamentTab = typeof tournamentTabs.$inferSelect

export const tournamentTeams = pgTable('tournament_teams', {
  id: uuid('id').primaryKey(),
  tournamentId: uuid('tournament_id').notNull().references(() => tournaments.id),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  joinedAt: timestamp('joined_at').defaultNow(),
  withdrawAt: timestamp('withdraw_at')
})
export type DrizzleTournamentTeam = typeof tournamentTeams.$inferSelect

export const matches = pgTable('matches', {
  id: uuid('id').primaryKey(),
  tournamentId: uuid('tournament_id').notNull().references(() => tournaments.id),
  blueTeamId: uuid('blue_team_id').notNull().references(() => teams.id),
  redTeamId: uuid('red_team_id').notNull().references(() => teams.id),
  blueTeamScore: integer('blue_team_score'),
  redTeamScore: integer('red_team_score'),
  riotMatchId: uuid('riot_match_id'),
  winnerTeamId: uuid('winner_team_id').references(() => teams.id),
  winCondition: text('win_condition', { enum: ['normal', 'wo', 'ff'] }),
  createdAt: timestamp('created_at').defaultNow()
})
export type DrizzleMatch = typeof matches.$inferSelect
