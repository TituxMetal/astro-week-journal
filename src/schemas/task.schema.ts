import { z } from 'astro:content'

export const taskSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10).optional(),
  status: z.enum(['pending', 'inProgress', 'completed']).optional().default('pending'),
  dueDate: z
    .string()
    .transform(date => new Date(date))
    .optional(),
  isPublic: z.boolean().optional().default(true)
})
