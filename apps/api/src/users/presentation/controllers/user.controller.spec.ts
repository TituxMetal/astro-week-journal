import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { beforeEach, describe, expect, it } from 'bun:test'

import { Role } from '~/authorization/domain/value-objects/role.vo'
import {
  createMockSession,
  MockGetUserUseCase,
  MockUpdateUserRoleUseCase
} from '~/test/mocks/users.mocks'
import { GetUserUseCase } from '~/users/application/use-cases/getUser.uc'
import { UpdateUserRoleUseCase } from '~/users/application/use-cases/updateUserRole.uc'

import { UserController } from './user.controller'

describe('UserController', () => {
  let controller: UserController
  let getUserUseCase: MockGetUserUseCase
  let updateUserRoleUseCase: MockUpdateUserRoleUseCase

  beforeEach(() => {
    getUserUseCase = new MockGetUserUseCase()
    updateUserRoleUseCase = new MockUpdateUserRoleUseCase()
    controller = new UserController(
      getUserUseCase as unknown as GetUserUseCase,
      updateUserRoleUseCase as unknown as UpdateUserRoleUseCase
    )
  })

  describe('GET /users/:id', () => {
    it('should return user when user exists', async () => {
      const result = await controller.getUser('user-1')

      expect(result.id).toBe('user-1')
      expect(result.email).toBe('user@example.com')
      expect(result.name).toBe('Test User')
      expect(result.role).toBe(Role.USER)
    })

    it('should throw NotFoundException when user does not exist', async () => {
      await expect(controller.getUser('non-existent')).rejects.toThrow(NotFoundException)
    })
  })

  describe('PUT /users/:id/role', () => {
    it('should allow ADMIN to update user role', async () => {
      const currentUser = createMockSession('admin-1', 'admin@example.com', 'Admin', 'admin')

      const result = await controller.updateUserRole(currentUser, 'user-1', { role: Role.EDITOR })

      expect(result.id).toBe('user-1')
      expect(result.role).toBe(Role.EDITOR)
    })

    it('should throw ForbiddenException when non-ADMIN tries to update role', async () => {
      const currentUser = createMockSession('user-1', 'user@example.com', 'User', 'user')

      await expect(
        controller.updateUserRole(currentUser, 'user-2', { role: Role.EDITOR })
      ).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException when ADMIN tries to change own role', async () => {
      const currentUser = createMockSession('admin-1', 'admin@example.com', 'Admin', 'admin')

      await expect(
        controller.updateUserRole(currentUser, 'admin-1', { role: Role.USER })
      ).rejects.toThrow(ForbiddenException)
    })

    it('should throw NotFoundException when target user does not exist', async () => {
      const currentUser = createMockSession('admin-1', 'admin@example.com', 'Admin', 'admin')

      await expect(
        controller.updateUserRole(currentUser, 'non-existent', { role: Role.EDITOR })
      ).rejects.toThrow(NotFoundException)
    })

    it('should successfully update to USER role', async () => {
      const currentUser = createMockSession('admin-1', 'admin@example.com', 'Admin', 'admin')

      const result = await controller.updateUserRole(currentUser, 'user-1', { role: Role.USER })

      expect(result.role).toBe(Role.USER)
    })

    it('should successfully update to EDITOR role', async () => {
      const currentUser = createMockSession('admin-1', 'admin@example.com', 'Admin', 'admin')

      const result = await controller.updateUserRole(currentUser, 'user-1', { role: Role.EDITOR })

      expect(result.role).toBe(Role.EDITOR)
    })

    it('should successfully update to ADMIN role', async () => {
      const currentUser = createMockSession('admin-1', 'admin@example.com', 'Admin', 'admin')

      const result = await controller.updateUserRole(currentUser, 'user-1', { role: Role.ADMIN })

      expect(result.role).toBe(Role.ADMIN)
    })
  })
})
