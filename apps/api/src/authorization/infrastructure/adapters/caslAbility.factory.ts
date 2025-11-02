import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { AbilityFactoryPort } from '~/authorization/domain/ports/abilityFactory.port'
import { Action } from '~/authorization/domain/value-objects/action.vo'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { AppAbility } from '~/authorization/infrastructure/config/casl.config'

/**
 * Type for permission configuration function
 */
type PermissionConfig = (can: AbilityBuilder<AppAbility>['can']) => void

/**
 * Map of roles to their permission configurations
 */
const ROLE_PERMISSIONS: Record<Role, PermissionConfig> = {
  [Role.ADMIN]: can => {
    can(Action.Manage, 'all')
  },
  [Role.EDITOR]: can => {
    can(Action.Read, 'all')
    can(Action.Create, 'Post')
    can(Action.Update, 'Post')
  },
  [Role.USER]: can => {
    can(Action.Read, 'Post')
    can(Action.Read, 'User')
  }
}

@Injectable()
export class CaslAbilityFactory implements AbilityFactoryPort {
  createForUser(user: UserEntity): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

    const role = user.getRole()
    const permissionConfig = ROLE_PERMISSIONS[role]

    if (permissionConfig) {
      permissionConfig(can)
    }

    return build()
  }
}
