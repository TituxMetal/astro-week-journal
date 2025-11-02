import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { beforeEach, describe, expect, it } from 'bun:test'

import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { UserManagementRepositoryPort } from '~/users/domain/ports/userManagementRepository.port'

import { UpdateUserRoleUseCase } from './updateUserRole.uc'

// Mock repository
class MockUserManagementRepository implements UserManagementRepositoryPort {
  private users: Map<string, UserEntity> = new Map()

  async findById(userId: string): Promise<UserEntity | null> {
    return this.users.get(userId) || null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.getEmail() === email) {
        return user
      }
    }
    return null
  }

  async updateUserRole(userId: string, newRole: Role): Promise<UserEntity> {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const updatedUser = new UserEntity(user.getId(), user.getEmail(), user.getName(), newRole)
    this.users.set(userId, updatedUser)
    return updatedUser
  }

  async countAdmins(): Promise<number> {
    let count = 0
    for (const user of this.users.values()) {
      if (user.getRole() === Role.ADMIN) {
        count++
      }
    }
    return count
  }

  // Helper methods for testing
  addUser(user: UserEntity): void {
    this.users.set(user.getId(), user)
  }

  clear(): void {
    this.users.clear()
  }
}

describe('UpdateUserRoleUseCase', () => {
  let useCase: UpdateUserRoleUseCase
  let repository: MockUserManagementRepository

  beforeEach(() => {
    repository = new MockUserManagementRepository()
    useCase = new UpdateUserRoleUseCase(repository)
  })

  describe('Authorization Rules', () => {
    it('should throw ForbiddenException when non-ADMIN tries to update role', async () => {
      const currentUser = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const targetUser = new UserEntity('user-2', 'target@example.com', 'Target', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      await expect(
        useCase.execute(currentUser.getId(), currentUser.getRole(), targetUser.getId(), Role.EDITOR)
      ).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException when EDITOR tries to update role', async () => {
      const currentUser = new UserEntity('user-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const targetUser = new UserEntity('user-2', 'target@example.com', 'Target', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      await expect(
        useCase.execute(currentUser.getId(), currentUser.getRole(), targetUser.getId(), Role.EDITOR)
      ).rejects.toThrow(ForbiddenException)
    })

    it('should allow ADMIN to update role', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.EDITOR
      )

      expect(result.role).toBe(Role.EDITOR)
    })
  })

  describe('Self-Role Change Prevention', () => {
    it('should throw ForbiddenException when ADMIN tries to change own role', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)

      repository.addUser(currentUser)

      await expect(
        useCase.execute(currentUser.getId(), currentUser.getRole(), currentUser.getId(), Role.USER)
      ).rejects.toThrow(ForbiddenException)
    })
  })

  describe('Last Admin Protection', () => {
    it('should throw ForbiddenException when trying to remove the last ADMIN', async () => {
      // Create a scenario where there's only 1 admin in the system
      // We use a "phantom" admin (not in repository) to perform the action
      // This tests the protection logic without violating Rule 4 (can't change own role)
      const onlyAdmin = new UserEntity('admin-1', 'admin@example.com', 'Only Admin', Role.ADMIN)

      repository.addUser(onlyAdmin)

      // A phantom admin (not in repository) tries to demote the only admin
      // The use case doesn't validate current user existence, only their role
      await expect(
        useCase.execute('phantom-admin-id', Role.ADMIN, onlyAdmin.getId(), Role.USER)
      ).rejects.toThrow(ForbiddenException)
    })

    it('should allow removing ADMIN role when there are 2 ADMINs (leaves 1)', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('admin-2', 'admin2@example.com', 'Admin 2', Role.ADMIN)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      // With 2 admins, demoting one leaves 1 admin - this should be allowed
      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.USER
      )

      expect(result.role).toBe(Role.USER)
    })

    it('should allow removing ADMIN role when there are multiple ADMINs', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('admin-2', 'admin2@example.com', 'Admin 2', Role.ADMIN)
      const thirdAdmin = new UserEntity('admin-3', 'admin3@example.com', 'Admin 3', Role.ADMIN)

      repository.addUser(currentUser)
      repository.addUser(targetUser)
      repository.addUser(thirdAdmin)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.EDITOR
      )

      expect(result.role).toBe(Role.EDITOR)
    })
  })

  describe('Role Validation', () => {
    it('should throw ForbiddenException for invalid role', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      await expect(
        useCase.execute(
          currentUser.getId(),
          currentUser.getRole(),
          targetUser.getId(),
          'invalid' as Role
        )
      ).rejects.toThrow(ForbiddenException)
    })

    it('should accept valid USER role', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.EDITOR)
      const thirdAdmin = new UserEntity('admin-2', 'admin2@example.com', 'Admin 2', Role.ADMIN)

      repository.addUser(currentUser)
      repository.addUser(targetUser)
      repository.addUser(thirdAdmin)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.USER
      )

      expect(result.role).toBe(Role.USER)
    })

    it('should accept valid EDITOR role', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.EDITOR
      )

      expect(result.role).toBe(Role.EDITOR)
    })

    it('should accept valid ADMIN role', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.ADMIN
      )

      expect(result.role).toBe(Role.ADMIN)
    })
  })

  describe('User Existence', () => {
    it('should throw NotFoundException when target user does not exist', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)

      repository.addUser(currentUser)

      await expect(
        useCase.execute(currentUser.getId(), currentUser.getRole(), 'non-existent-id', Role.EDITOR)
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('Successful Role Updates', () => {
    it('should successfully update USER to EDITOR', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.EDITOR
      )

      expect(result.id).toBe(targetUser.getId())
      expect(result.email).toBe(targetUser.getEmail())
      expect(result.name).toBe(targetUser.getName())
      expect(result.role).toBe(Role.EDITOR)
    })

    it('should successfully update EDITOR to ADMIN', async () => {
      const currentUser = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const targetUser = new UserEntity('user-1', 'user@example.com', 'User', Role.EDITOR)

      repository.addUser(currentUser)
      repository.addUser(targetUser)

      const result = await useCase.execute(
        currentUser.getId(),
        currentUser.getRole(),
        targetUser.getId(),
        Role.ADMIN
      )

      expect(result.role).toBe(Role.ADMIN)
    })
  })
})
