CREATE TABLE `matches` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tournament_id` bigint NOT NULL,
	`blue_team_id` bigint NOT NULL,
	`red_team_id` bigint NOT NULL,
	`blue_team_score` int,
	`red_team_score` int,
	`riot_match_id` bigint,
	`winner_team_id` bigint,
	`win_condition` enum('normal','wo','ff'),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`riot_id` varchar(256) NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_idx` UNIQUE(`email`),
	CONSTRAINT `riot_id_idx` UNIQUE(`riot_id`)
);
--> statement-breakpoint
CREATE TABLE `team_players` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`player_id` bigint NOT NULL,
	`team_id` bigint NOT NULL,
	`joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`removed_at` datetime,
	`removed_by` bigint,
	CONSTRAINT `team_players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`created_by` bigint NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournament_tabs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tournament_id` bigint NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` longtext NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tournament_tabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournament_teams` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tournament_id` bigint NOT NULL,
	`team_id` bigint NOT NULL,
	`joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`withdraw_at` datetime,
	CONSTRAINT `tournament_teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tournaments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` longtext,
	`start_date` datetime,
	`end_date` datetime,
	`winner_team_id` bigint,
	`min_teams` int,
	`max_teams` int,
	`status` enum('draft','public','finished') DEFAULT 'draft',
	`created_by` bigint NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tournaments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `matches` ADD CONSTRAINT `matches_tournament_id_tournaments_id_fk` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matches` ADD CONSTRAINT `matches_blue_team_id_teams_id_fk` FOREIGN KEY (`blue_team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matches` ADD CONSTRAINT `matches_red_team_id_teams_id_fk` FOREIGN KEY (`red_team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `matches` ADD CONSTRAINT `matches_winner_team_id_teams_id_fk` FOREIGN KEY (`winner_team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_players` ADD CONSTRAINT `team_players_player_id_players_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_players` ADD CONSTRAINT `team_players_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_players` ADD CONSTRAINT `team_players_removed_by_players_id_fk` FOREIGN KEY (`removed_by`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teams` ADD CONSTRAINT `teams_created_by_players_id_fk` FOREIGN KEY (`created_by`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tournament_tabs` ADD CONSTRAINT `tournament_tabs_tournament_id_tournaments_id_fk` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tournament_teams` ADD CONSTRAINT `tournament_teams_tournament_id_tournaments_id_fk` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tournament_teams` ADD CONSTRAINT `tournament_teams_team_id_teams_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tournaments` ADD CONSTRAINT `tournaments_winner_team_id_teams_id_fk` FOREIGN KEY (`winner_team_id`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tournaments` ADD CONSTRAINT `tournaments_created_by_players_id_fk` FOREIGN KEY (`created_by`) REFERENCES `players`(`id`) ON DELETE no action ON UPDATE no action;