import { index, char, bigint, text, integer, uniqueIndex, pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull(),
  riotId: varchar('riot_id', { length: 256 }).notNull(),
  riotPuuid: varchar('riot_puuid', { length: 256 }).notNull(),
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

export const teamPlayerInvites = pgTable('team_player_invites', {
  id: uuid('id').primaryKey(),
  playerId: uuid('player_id').notNull().references(() => players.id),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  acceptedAt: timestamp('accepted_at'),
  rejectedAt: timestamp('rejected_at'),
  invitedAt: timestamp('invited_at').defaultNow(),
  invitedBy: uuid('invited_by').references(() => players.id)
})
export type DrizzleTeamPlayerInvite = typeof teamPlayerInvites.$inferSelect

export const tournaments = pgTable('tournaments', {
  id: uuid('id').primaryKey(),
  riotProviderId: integer('riot_provider_id').notNull().references(() => riotTournamentProviders.providerId),
  riotTournamentId: integer('riot_tournament_id').notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  rules: text('rules'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  winnerTeamId: uuid('winner_team_id').references(() => teams.id),
  minTeams: integer('min_teams'),
  maxTeams: integer('max_teams'),
  status: text('status', { enum: ['draft', 'public', 'finished'] }).default('draft'),
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
  riotTournamentCode: varchar('riot_tournament_code', { length: 256 }).notNull(),
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

export const riotGameResults = pgTable('riot_game_results', {
  id: uuid('id').primaryKey(),
  startTime: bigint('start_time', { mode: 'number' }).notNull(),
  shortCode: varchar('short_code', { length: 256 }).notNull(),
  metaData: text('metadata'),
  gameId: bigint('game_id', { mode: 'number' }).notNull(),
  gameName: uuid('game_name').notNull(),
  gameType: varchar('game_type', { length: 256 }).notNull(),
  gameMap: integer('game_map').notNull(),
  gameMode: varchar('game_mode', { length: 256 }).notNull(),
  region: varchar('region', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
})
export type DrizzleRiotGameResult = typeof riotGameResults.$inferSelect

export const riotTournamentProviders = pgTable('riot_tournament_providers', {
  id: uuid('id').primaryKey(),
  providerId: integer('provider_id').notNull(),
  char: char('char').notNull(),
  url: varchar('url', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
}, (riotTournamentProviders) => ({
  providerIdIndex: index('provider_id_idx').on(riotTournamentProviders.providerId)
}))
export type DrizzleRiotTournamentProvider = typeof riotTournamentProviders.$inferSelect
