import { Inject, Injectable } from '@nestjs/common'

import { IAbility } from '~/authorization/domain/ports/ability.interface'
import {
  ABILITY_FACTORY,
  AbilityFactoryPort
} from '~/authorization/domain/ports/abilityFactory.port'
import {
  USER_REPOSITORY,
  UserRepositoryPort
} from '~/authorization/domain/ports/userRepository.port'
import { Action } from '~/authorization/domain/value-objects/action.vo'

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(ABILITY_FACTORY) private readonly abilityFactory: AbilityFactoryPort
  ) {}

  async getUserAbilities(userId: string): Promise<IAbility> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return this.abilityFactory.createForUser(user)
  }

  async checkPermission(userId: string, action: Action, subject: string): Promise<boolean> {
    const ability = await this.getUserAbilities(userId)

    return ability.can(action, subject)
  }
}
