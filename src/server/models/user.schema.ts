import { techs } from "@/components/EditLinksButton";
import { user } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserSelectSchema = createSelectSchema(user);
export const UserInputSchema = createInsertSchema(user, {
  username: (schema) => schema.min(3).max(10),
  intro: (schema) =>
    schema
      .min(1, { message: "一文字も入力されていません。" })
      .max(40, { message: "40文字以内で入力してください。" }),
});

export const UsernameSchema = UserSelectSchema.pick({
  username: true,
});

export const UsernameInputSchema = UserInputSchema.pick({
  username: true,
});

export const UserCheckQuerySchema = z.object({
  username: z.string(),
});

export const SkillSchema = z.object({
  name: z.string(),
  level: z.string(),
});

export const WorkSchema = z.object({
  title: z.string(),
  desc: z.string(),
  siteUrl: z.string(),
  pictureUrl: z.string(),
})

export const SkillsSchema = z.object({
  skills: z.array(SkillSchema),
});

export const WorksSchema = z.object({
  works: z.array(WorkSchema)
});

export const portofolioSchema = UserSelectSchema.pick({
  name: true,
  username: true,
  intro: true,
  skills: true,
  twitter: true,
  github: true,
  zenn: true,
  qiita: true,
  works: true,
}).extend({
  skills: SkillsSchema,
});

export const UpdateWorkPayloadSchema = z.object({
  title: z.string().min(1, { message: "何も入力されていません。" }).max(20, { message: "最大20文字までです。" }),
  desc: z.string().min(1, { message: "何も入力されていません。" }).max(100, { message: "最大100文字までです。" }),
  siteUrl: z.string(),
  index: z.string(),
  image: z.any().optional()
});

export const IntroInputSchema = UserInputSchema.pick({
  intro: true,
});

export type profileSchemaType = z.infer<typeof portofolioSchema>
export type SkillType = z.infer<typeof SkillSchema>
export type WorkType = z.infer<typeof WorkSchema>
export type ProfileWithTypedSkills = Omit<profileSchemaType, "skills"> & {
  skills: SkillType[];
  works: WorkType[];
};

export type UpdateWorkPayloadSchemaType = z.infer<typeof UpdateWorkPayloadSchema>;
