import type { Prisma } from '@prisma/client'
import { prisma } from '~/lib/prisma'

export const getTasks = async () => {
  const tasks = await prisma.task.findMany()

  return tasks
}

const getFilteredTasks = async ({
  where,
  select
}: {
  where: Prisma.TaskWhereInput
  select: Prisma.TaskSelect
}) => {
  const tasks = await prisma.task.findMany({ where, select })

  return tasks
}

enum TaskStatus {
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  PENDING = 'pending'
}

export const getTasksByStatus = async (status: TaskStatus) => {
  const tasks = await getFilteredTasks({
    where: { status },
    select: { id: true, title: true, status: true }
  })

  return tasks
}

export const getPublicTasks = async (isPublic: boolean = true) => {
  const tasks = await getFilteredTasks({
    where: { isPublic },
    select: { id: true, title: true, status: true }
  })

  return tasks
}

export const createTask = async (task: Prisma.TaskCreateInput) => {
  const newTask = await prisma.task.create({ data: task })

  return newTask
}
