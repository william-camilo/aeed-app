CREATE TABLE `analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`situation` text NOT NULL,
	`channel` text NOT NULL,
	`message` text NOT NULL,
	`result` text NOT NULL,
	`favorite` integer DEFAULT 0 NOT NULL,
	`copied` integer DEFAULT 0 NOT NULL,
	`outcome` text DEFAULT 'Em andamento' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analyses_user_date` ON `analyses` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `practices` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`scenario` text NOT NULL,
	`answer` text NOT NULL,
	`review` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_practices_user_date` ON `practices` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
