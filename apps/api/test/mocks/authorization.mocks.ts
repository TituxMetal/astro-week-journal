import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { IAbility } from '~/authorization/domain/ports/ability.interface'
import { AbilityFactoryPort } from '~/authorization/domain/ports/abilityFactory.port'
import { UserRepositoryPort } from '~/authorization/domain/ports/userRepository.port'
import { Action } from '~/authorization/domain/value-objects/action.vo'
import { Role } from '~/authorization/domain/value-objects/role.vo'

/**
 * Mock UserRepository for testing
 * Pre-seeded with test users for each role
 */
export class MockUserRepository implements UserRepositoryPort {
  private users: Map<string, UserEntity> = new Map()

  constructor() {
    // Seed with test users
    this.users.set('user-1', new UserEntity('user-1', 'user@example.com', 'Test User', Role.USER))
    this.users.set(
      'editor-1',
      new UserEntity('editor-1', 'editor@example.com', 'Test Editor', Role.EDITOR)
    )
    this.users.set(
      'admin-1',
      new UserEntity('admin-1', 'admin@example.com', 'Test Admin', Role.ADMIN)
    )
  }

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
}

/**
 * Mock AbilityFactory for testing
 * Implements role-based permission logic matching the real CaslAbilityFactory
 */
export class MockAbilityFactory implements AbilityFactoryPort {
  createForUser(user: UserEntity): IAbility {
    const role = user.getRole()

    const canFn = (action: Action, subject: string): boolean => {
      if (role === Role.ADMIN) {
        return true // Admin can do everything
      }
      if (role === Role.EDITOR) {
        if (action === Action.Read) return true
        if (subject === 'Post' && [Action.Create, Action.Update].includes(action)) return true
        return false
      }
      if (role === Role.USER) {
        if (action === Action.Read && ['Post', 'User'].includes(subject)) return true
        return false
      }
      return false
    }

    return {
      can: canFn,
      cannot: (action: Action, subject: string): boolean => {
        return !canFn(action, subject)
      }
    }
  }
}
