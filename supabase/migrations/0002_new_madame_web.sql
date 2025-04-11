CREATE TABLE "experience" (
	"start_period" timestamp NOT NULL,
	"end_period" timestamp NOT NULL,
	"title" text NOT NULL,
	"desc" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" integer NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"desc" text NOT NULL,
	"site_url" text NOT NULL,
	"techs" json NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "twitter" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "github" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "zenn" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "qiita" text;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work" ADD CONSTRAINT "work_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_twitter_unique" UNIQUE("twitter");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_github_unique" UNIQUE("github");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_zenn_unique" UNIQUE("zenn");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_qiita_unique" UNIQUE("qiita");