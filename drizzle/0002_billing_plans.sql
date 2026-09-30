ALTER TABLE `users` ADD COLUMN `plan` text NOT NULL DEFAULT 'individual';
ALTER TABLE `users` ADD COLUMN `subscription_status` text NOT NULL DEFAULT 'active';
UPDATE `users` SET `plan` = 'team' WHERE `role` = 'manager' AND `plan` = 'individual';
