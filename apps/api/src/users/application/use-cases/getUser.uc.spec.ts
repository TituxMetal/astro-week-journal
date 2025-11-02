import { NotFoundException } from '@nestjs/common'
import { describe, expect, it, beforeEach } from 'bun:test'

import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { UserManagementRepositoryPort } from '~/users/domain/ports/userManagementRepository.port'

import { GetUserUseCase } from './getUser.uc'

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

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase
  let repository: MockUserManagementRepository

  beforeEach(() => {
    repository = new MockUserManagementRepository()
    useCase = new GetUserUseCase(repository)
  })

  describe('User Retrieval', () => {
    it('should return user when user exists', async () => {
      const user = new UserEntity('user-1', 'user@example.com', 'Test User', Role.USER)
      repository.addUser(user)

      const result = await useCase.execute(user.getId())

      expect(result.id).toBe(user.getId())
      expect(result.email).toBe(user.getEmail())
      expect(result.name).toBe(user.getName())
      expect(result.role).toBe(user.getRole())
    })

    it('should throw NotFoundException when user does not exist', async () => {
      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException)
    })

    it('should return correct role for USER', async () => {
      const user = new UserEntity('user-1', 'user@example.com', 'Test User', Role.USER)
      repository.addUser(user)

      const result = await useCase.execute(user.getId())

      expect(result.role).toBe(Role.USER)
    })

    it('should return correct role for EDITOR', async () => {
      const user = new UserEntity('user-1', 'editor@example.com', 'Test Editor', Role.EDITOR)
      repository.addUser(user)

      const result = await useCase.execute(user.getId())

      expect(result.role).toBe(Role.EDITOR)
    })

    it('should return correct role for ADMIN', async () => {
      const user = new UserEntity('user-1', 'admin@example.com', 'Test Admin', Role.ADMIN)
      repository.addUser(user)

      const result = await useCase.execute(user.getId())

      expect(result.role).toBe(Role.ADMIN)
    })
  })
})
