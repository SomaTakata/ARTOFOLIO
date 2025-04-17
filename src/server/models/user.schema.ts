import { user } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserSelectSchema = createSelectSchema(user);
export const UserInputSchema = createInsertSchema(user, {
  username: (schema) => schema.min(3).max(10),
  intro: (schema) =>
    schema
      .min(1, { message: "Nothing has been entered." })
      .max(100, { message: "Please enter within 100 characters." }),
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
  siteUrl: z.string().url().or(z.literal("")),
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
  works: true,
  sns: true
}).extend({
  skills: SkillsSchema,
  works: WorksSchema,
  editable: z.boolean(),
  loginUser: z.string()
});

export const SnsSchema = z.object({
  linkedin: z.string().url().or(z.literal("")),
  facebook: z.string().url().or(z.literal("")),
  github: z.string().url().or(z.literal("")),
  x: z.string().url().or(z.literal("")),
  other: z.string().url().or(z.literal(""))
})

export const UpdateWorkPayloadSchema = z.object({
  title: z.string()
    .min(1, { message: "Nothing has been entered." })
    .max(20, { message: "Please enter within 20 characters." }),
  desc: z.string()
    .min(1, { message: "Nothing has been entered." })
    .max(100, { message: "Please enter within 100 characters." }),
  siteUrl: z.string().url().or(z.literal("")),
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
  sns: SnsSchemaType;
  editable: boolean
};
export type UpdateWorkPayloadSchemaType = z.infer<typeof UpdateWorkPayloadSchema>;
export type SnsSchemaType = z.infer<typeof SnsSchema>
