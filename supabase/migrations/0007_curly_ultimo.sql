ALTER TABLE "user" DROP CONSTRAINT "user_twitter_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_github_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_zenn_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_qiita_unique";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "works" SET DEFAULT '[{"title":"test","desc":"test","siteUrl":"https://example.com","pictureUrl":"/portfolio1.png"},{"title":"test","desc":"test","siteUrl":"https://example.com","pictureUrl":"/portfolio1.png"},{"title":"test","desc":"test","siteUrl":"https://example.com","pictureUrl":"/portfolio1.png"},{"title":"test","desc":"test","siteUrl":"https://example.com","pictureUrl":"/portfolio1.png"}]'::jsonb;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "sns" jsonb DEFAULT '{"zenn":"","qiita":"","twitter":"","github":""}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "twitter";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "github";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "zenn";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "qiita";