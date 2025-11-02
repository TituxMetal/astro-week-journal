import { UserEntity } from '~/authorization/domain/entities/user.entity'

import { IAbility } from './ability.interface'

export interface AbilityFactoryPort {
  createForUser(user: UserEntity): IAbility
}

export const ABILITY_FACTORY = Symbol('ABILITY_FACTORY')
