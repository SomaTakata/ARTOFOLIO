import { relations } from 'drizzle-orm';
import { boolean, integer, json, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const initialSkills = [
       { name: "Next.js", level: "5" },
       { name: "Tailwind", level: "3" },
       { name: "Prisma", level: "1" },
       { name: "Auth.js", level: "3" },
       { name: "Supabase", level: "4" },
];

const initialWorks = [
       {
              title: "Under preparation",
              desc: "We apologize for the inconvenience.\nThe painting is currently being prepared.",
              siteUrl: "",
              pictureUrl: "/first-work.png",
       },
       {
              title: "Under preparation",
              desc: "We apologize for the inconvenience.\nThe painting is currently being prepared.",
              siteUrl: "",
              pictureUrl: "/first-work.png",
       },
       {
              title: "Under preparation",
              desc: "We apologize for the inconvenience.\nThe painting is currently being prepared.",
              siteUrl: "",
              pictureUrl: "/first-work.png",
       },
       {
              title: "Under preparation",
              desc: "We apologize for the inconvenience.\nThe painting is currently being prepared.",
              siteUrl: "",
              pictureUrl: "/first-work.png",
       },
]

const initialSNS = {
       linkedin: "",
       facebook: "",
       x: "",
       github: "",
       other: ""
};

export const user = pgTable("user", {
       id: text("id").primaryKey(),
       name: text('name').notNull(),
       email: text('email').notNull().unique(),
       emailVerified: boolean('email_verified').notNull(),
       image: text('image'),
       username: text('username').unique(),
       intro: text('intro').notNull().default("Click the Update button to register a brief self-introduction!"),
       skills: jsonb('skills').notNull().default(initialSkills),
       works: jsonb("works").notNull().default(initialWorks),
       sns: jsonb("sns").notNull().default(initialSNS),
       createdAt: timestamp('created_at').notNull(),
       updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
       id: text("id").primaryKey(),
       expiresAt: timestamp('expires_at').notNull(),
       token: text('token').notNull().unique(),
       createdAt: timestamp('created_at').notNull(),
       updatedAt: timestamp('updated_at').notNull(),
       ipAddress: text('ip_address'),
       userAgent: text('user_agent'),
       userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
       id: text("id").primaryKey(),
       accountId: text('account_id').notNull(),
       providerId: text('provider_id').notNull(),
       userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
       accessToken: text('access_token'),
       refreshToken: text('refresh_token'),
       idToken: text('id_token'),
       accessTokenExpiresAt: timestamp('access_token_expires_at'),
       refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
       scope: text('scope'),
       password: text('password'),
       createdAt: timestamp('created_at').notNull(),
       updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
       id: text("id").primaryKey(),
       identifier: text('identifier').notNull(),
       value: text('value').notNull(),
       expiresAt: timestamp('expires_at').notNull(),
       createdAt: timestamp('created_at'),
       updatedAt: timestamp('updated_at')
});

export const skill = pgTable("skill", {
       id: text("id").primaryKey(),
       name: text('name').notNull(),
       level: integer('level').notNull(),
       userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const experience = pgTable("experience", {
       startPeriod: timestamp('start_period').notNull(),
       endPeriod: timestamp('end_period').notNull(),
       title: text('title').notNull(),
       desc: text('desc').notNull(),
       userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
})

export const work = pgTable("work", {
       id: text("id").primaryKey(),
       title: text('title').notNull(),
       desc: text('desc').notNull(),
       siteUrl: text('site_url').notNull(),
       techs: json('techs').notNull(),
       userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
})

export const skillRelations = relations(skill, ({ one }) => ({
       user: one(user, {
              fields: [skill.userId],
              references: [user.id],
       }),
}));

export const experienceRelations = relations(experience, ({ one }) => ({
       user: one(user, {
              fields: [experience.userId],
              references: [user.id],
       }),
}));

export const workRelations = relations(work, ({ one }) => ({
       user: one(user, {
              fields: [work.userId],
              references: [user.id],
       }),
}));
