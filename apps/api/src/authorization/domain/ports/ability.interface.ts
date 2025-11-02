import { Action } from '~/authorization/domain/value-objects/action.vo'

/**
 * Domain interface for abilities - independent from infrastructure
 */
export interface IAbility {
  can(action: Action, subject: string): boolean
  cannot(action: Action, subject: string): boolean
}
