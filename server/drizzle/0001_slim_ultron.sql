ALTER TABLE `projects` ADD `github_repo` varchar(255);--> statement-breakpoint
ALTER TABLE `projects` ADD `github_branch` varchar(100) DEFAULT 'main';--> statement-breakpoint
ALTER TABLE `users` ADD `github_token` text;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `files`;