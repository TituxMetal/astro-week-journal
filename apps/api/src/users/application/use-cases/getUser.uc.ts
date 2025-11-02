import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { Role } from '~/authorization/domain/value-objects/role.vo'
import {
  USER_MANAGEMENT_REPOSITORY,
  UserManagementRepositoryPort
} from '~/users/domain/ports/userManagementRepository.port'

/**
 * Use Case: Get User by ID
 *
 * Returns user information including their role
 */
@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly userRepository: UserManagementRepositoryPort
  ) {}

  async execute(userId: string): Promise<{ id: string; email: string; name: string; role: Role }> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      role: user.getRole()
    }
  }
}
