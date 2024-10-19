import { auth } from './auth.actions'
import { task } from './task.actions'

export const server = {
  signup: auth.signup,
  login: auth.login,
  logout: auth.logout,
  createTask: task.create
}
