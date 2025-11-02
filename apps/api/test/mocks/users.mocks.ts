import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { Role } from '~/authorization/domain/value-objects/role.vo'

/**
 * Mock GetUserUseCase for testing
 * Returns predefined user data or throws NotFoundException for 'non-existent' userId
 */
export class MockGetUserUseCase {
  async execute(userId: string) {
    if (userId === 'non-existent') {
      throw new NotFoundException('User not found')
    }
    return {
      id: userId,
      email: 'user@example.com',
      name: 'Test User',
      role: Role.USER
    }
  }
}

/**
 * Mock UpdateUserRoleUseCase for testing
 * Implements the same business rules as the real use case:
 * - Only ADMIN can update roles
 * - Cannot change own role
 * - Target user must exist
 */
export class MockUpdateUserRoleUseCase {
  async execute(currentUserId: string, currentUserRole: Role, targetUserId: string, newRole: Role) {
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only administrators can update user roles')
    }
    if (currentUserId === targetUserId) {
      throw new ForbiddenException('You cannot change your own role')
    }
    if (targetUserId === 'non-existent') {
      throw new NotFoundException('User not found')
    }
    return {
      id: targetUserId,
      email: 'target@example.com',
      name: 'Target User',
      role: newRole
    }
  }
}

/**
 * Helper function to create mock Better Auth session objects
 * Useful for testing controllers that use @Session() decorator
 *
 * @param userId - User ID
 * @param email - User email
 * @param name - User name
 * @param role - User role (as string)
 * @returns Mock UserSession object matching Better Auth structure
 */
export const createMockSession = (userId: string, email: string, name: string, role: string) => ({
  session: {
    id: `session-${userId}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
    expiresAt: new Date(Date.now() + 86400000),
    token: `token-${userId}`
  },
  user: {
    id: userId,
    email,
    name,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: false
  }
})
