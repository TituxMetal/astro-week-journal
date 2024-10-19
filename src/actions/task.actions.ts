import { ActionError, defineAction } from 'astro:actions'
import { taskSchema } from '~/schemas/task.schema'
import { createTask } from '~/services/tasks.service'

export const task = {
  create: defineAction({
    accept: 'form',
    input: taskSchema,
    handler: async ({ title, description, status, dueDate, isPublic }, context) => {
      try {
        const session = context.locals.session

        if (!session) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create a task'
          })
        }

        const newTask = await createTask({ title, description, status, dueDate, isPublic })

        return { success: true, data: newTask }
      } catch (error) {
        if (error instanceof ActionError) {
          throw error
        }

        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred during task creation'
        })
      }
    }
  })
}
