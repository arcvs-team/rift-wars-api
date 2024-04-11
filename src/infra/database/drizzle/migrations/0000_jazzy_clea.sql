CREATE TABLE IF NOT EXISTS "matches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tournament_id" uuid NOT NULL,
	"riot_tournament_code" varchar(256) NOT NULL,
	"blue_team_id" uuid NOT NULL,
	"red_team_id" uuid NOT NULL,
	"blue_team_score" integer,
	"red_team_score" integer,
	"riot_match_id" uuid,
	"winner_team_id" uuid,
	"win_condition" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"riot_id" varchar(256) NOT NULL,
	"riot_puuid" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "riot_game_results" (
	"id" uuid PRIMARY KEY NOT NULL,
	"start_time" bigint NOT NULL,
	"short_code" varchar(256) NOT NULL,
	"metadata" text,
	"game_id" bigint NOT NULL,
	"game_name" uuid NOT NULL,
	"game_type" varchar(256) NOT NULL,
	"game_map" integer NOT NULL,
	"game_mode" varchar(256) NOT NULL,
	"region" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "riot_tournament_providers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"char" "char" NOT NULL,
	"url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_player_invites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"player_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"accepted_at" timestamp,
	"rejected_at" timestamp,
	"invited_at" timestamp DEFAULT now(),
	"invited_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_players" (
	"id" uuid PRIMARY KEY NOT NULL,
	"player_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"removed_at" timestamp,
	"removed_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_tabs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tournament_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament_teams" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tournament_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	"withdraw_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournaments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"riot_provider_id" integer NOT NULL,
	"riot_tournament_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"rules" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"winner_team_id" uuid,
	"min_teams" integer,
	"max_teams" integer,
	"status" text DEFAULT 'draft',
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "players" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "riot_id_idx" ON "players" ("riot_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_blue_team_id_teams_id_fk" FOREIGN KEY ("blue_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_red_team_id_teams_id_fk" FOREIGN KEY ("red_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_team_id_teams_id_fk" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_player_invites" ADD CONSTRAINT "team_player_invites_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_player_invites" ADD CONSTRAINT "team_player_invites_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_player_invites" ADD CONSTRAINT "team_player_invites_invited_by_players_id_fk" FOREIGN KEY ("invited_by") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_players" ADD CONSTRAINT "team_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_players" ADD CONSTRAINT "team_players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_players" ADD CONSTRAINT "team_players_removed_by_players_id_fk" FOREIGN KEY ("removed_by") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_players_id_fk" FOREIGN KEY ("created_by") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_tabs" ADD CONSTRAINT "tournament_tabs_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_riot_provider_id_riot_tournament_providers_provider_id_fk" FOREIGN KEY ("riot_provider_id") REFERENCES "riot_tournament_providers"("provider_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_winner_team_id_teams_id_fk" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_created_by_players_id_fk" FOREIGN KEY ("created_by") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
