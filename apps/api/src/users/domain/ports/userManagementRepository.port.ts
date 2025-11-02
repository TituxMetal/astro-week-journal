import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { Role } from '~/authorization/domain/value-objects/role.vo'

/**
 * Port: User Management Repository
 *
 * Extends the basic user repository with management operations
 */
export interface UserManagementRepositoryPort {
  findById(userId: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  updateUserRole(userId: string, newRole: Role): Promise<UserEntity>
  countAdmins(): Promise<number>
}

export const USER_MANAGEMENT_REPOSITORY = Symbol('USER_MANAGEMENT_REPOSITORY')
