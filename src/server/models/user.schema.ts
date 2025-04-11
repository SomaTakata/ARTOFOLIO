import { user } from '@/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const UserSelectSchema = createSelectSchema(user)
export const UserInputSchema = createInsertSchema(user, {
  username: (schema) => schema.min(3).max(10)
})

export const UsernameSchema = UserSelectSchema.pick({
  username: true
})

export const UsernameInputSchema = UserInputSchema.pick({
  username: true
})
