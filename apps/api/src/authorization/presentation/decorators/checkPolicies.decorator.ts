import { SetMetadata } from '@nestjs/common'

import { IAbility } from '~/authorization/domain/ports/ability.interface'

export const CHECK_POLICIES_KEY = 'check_policies'

/**
 * Policy handler function type
 */
type PolicyHandler = (ability: IAbility) => boolean

/**
 * Decorator to check policies on routes
 * @param handlers - Array of policy handler functions
 *
 * @example
 * ```ts
 * @CheckPolicies((ability) => ability.can(Action.Read, 'Post'))
 * async findAll() {
 *   // ...
 * }
 * ```
 */
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)
