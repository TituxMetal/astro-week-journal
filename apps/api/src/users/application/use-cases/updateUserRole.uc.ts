import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Role } from '~/authorization/domain/value-objects/role.vo'
import {
  USER_MANAGEMENT_REPOSITORY,
  UserManagementRepositoryPort
} from '~/users/domain/ports/userManagementRepository.port'

/**
 * Use Case: Update User Role
 *
 * Business Rules:
 * 1. Only ADMIN users can update roles
 * 2. Cannot remove the last ADMIN from the system
 * 3. Role must be a valid enum value (USER, EDITOR, ADMIN)
 * 4. Cannot change own role (security measure)
 */
@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly userRepository: UserManagementRepositoryPort
  ) {}

  async execute(
    currentUserId: string,
    currentUserRole: Role,
    targetUserId: string,
    newRole: Role
  ): Promise<{ id: string; email: string; name: string; role: Role }> {
    // Rule 1: Only ADMIN can update roles
    if (currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException('Only administrators can update user roles')
    }

    // Rule 4: Cannot change own role
    if (currentUserId === targetUserId) {
      throw new ForbiddenException('You cannot change your own role')
    }

    // Validate role is a valid enum value
    if (!Object.values(Role).includes(newRole)) {
      throw new ForbiddenException(`Invalid role: ${newRole}`)
    }

    // Find the target user
    const targetUser = await this.userRepository.findById(targetUserId)
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`)
    }

    // Rule 2: Cannot remove the last ADMIN
    if (targetUser.getRole() === Role.ADMIN && newRole !== Role.ADMIN) {
      const adminCount = await this.userRepository.countAdmins()
      if (adminCount <= 1) {
        throw new ForbiddenException('Cannot remove the last administrator from the system')
      }
    }

    // Update the user's role
    const updatedUser = await this.userRepository.updateUserRole(targetUserId, newRole)

    return {
      id: updatedUser.getId(),
      email: updatedUser.getEmail(),
      name: updatedUser.getName(),
      role: updatedUser.getRole()
    }
  }
}
