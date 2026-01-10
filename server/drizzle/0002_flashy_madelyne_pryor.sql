ALTER TABLE `users` ADD `github_repo_visibility` varchar(20) DEFAULT 'private';--> statement-breakpoint
ALTER TABLE `users` ADD `github_auto_sync` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `users` ADD `github_default_branch` varchar(100) DEFAULT 'main';